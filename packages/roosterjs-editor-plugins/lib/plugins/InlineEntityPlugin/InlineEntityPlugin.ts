import { insertEntity } from 'roosterjs-editor-api/lib';
import {
    cacheGetEventData,
    createRange,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    isCharacterValue,
    matchesSelector,
    Position,
    safeInstanceOf,
    splitParentNode,
    splitTextNode,
    unwrap,
} from 'roosterjs-editor-dom/lib';
import {
    EditorPlugin,
    Entity,
    EntityOperation,
    EntityOperationEvent,
    GenericContentEditFeature,
    IEditor,
    Keys,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
    PluginKeyDownEvent,
    PositionType,
} from 'roosterjs-editor-types';

const DELIMITER_BEFORE = '_DelimiterBefore';
const DELIMITER_AFTER = '_DelimiterAfter';
const NBSP = '\u00A0';
const ZERO_WIDTH_SPACE = '\u200B';

enum DelimiterType {
    After = 1,
    Before = -1,
}

/**
 * @internal
 * MouseUpPlugin help trigger MouseUp event even when mouse up happens outside editor
 * as long as the mouse was pressed within Editor before
 */
export default class InlineEntityPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private id: number = 0;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'InlineEntityPlugin';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.initCEF();
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.EntityOperation) {
            if (event.operation == EntityOperation.NewEntity) {
                const { wrapper, type } = event.entity;
                if (isReadOnly(event.entity)) {
                    const element = wrapper as HTMLElement;

                    if (isBetweenDelimiter(element)) {
                        return;
                    }

                    const elementBefore = this.insertNode(
                        `${ZERO_WIDTH_SPACE}`,
                        element,
                        'beforebegin'
                    );
                    const elementAfter = this.insertNode(
                        `${ZERO_WIDTH_SPACE}`,
                        element,
                        'afterend'
                    );

                    this.id++;

                    insertEntity(
                        this.editor,
                        this.id + DELIMITER_BEFORE,
                        elementBefore,
                        false /* isBlock */,
                        false /* isReadOnly */,
                        Position.getStart(createRange(elementBefore))
                    );

                    insertEntity(
                        this.editor,
                        this.id + DELIMITER_AFTER,
                        elementAfter,
                        false /* isBlock */,
                        false /* isReadOnly */,
                        Position.getStart(createRange(elementAfter))
                    );

                    unwrap(elementAfter);
                    unwrap(elementBefore);
                } else {
                    if (type.indexOf(DELIMITER_AFTER) >= 0) {
                        this.editor.runAsync(() => {
                            this.editor.select(
                                new Position(new Position(wrapper, PositionType.After))
                            );
                        });
                    }
                }
            }
            if (
                event.operation == EntityOperation.RemoveFromStart ||
                event.operation == EntityOperation.RemoveFromEnd ||
                event.operation == EntityOperation.Overwrite
            ) {
                const entity = event.entity;
                const id = entity.id;

                const delimiter = isDelimiter(entity);

                if (delimiter) {
                    const [delimiterType, entity] = delimiter;

                    if (delimiterType == DelimiterType.After) {
                        const idBefore = id.substring(0, id.indexOf('_')) + DELIMITER_BEFORE;
                        const elBefore = this.editor.queryElements(getEntitySelector(idBefore))[0];

                        if (elBefore) {
                            this.editor.select(
                                createRange(
                                    new Position(elBefore, 0),
                                    new Position(entity.wrapper, PositionType.After)
                                )
                            );

                            this.triggerEntityEvent(entity, event);
                        }
                    } else if (delimiterType == DelimiterType.Before) {
                        const idAfter = id.substring(0, id.indexOf('_')) + DELIMITER_AFTER;
                        const elAfter = this.editor.queryElements(getEntitySelector(idAfter))[0];

                        if (elAfter) {
                            this.editor.select(
                                createRange(
                                    new Position(entity.wrapper, PositionType.Before),
                                    new Position(elAfter, 0)
                                )
                            );
                            this.triggerEntityEvent(entity, event, true /* deletedFromBefore */);
                        }
                    }
                }

                if (isReadOnly(entity)) {
                    removeDelimiters(entity.wrapper);
                }
            }
            if (event.operation == EntityOperation.Click) {
                const range = this.editor.getSelectionRange();
                if (isReadOnly(event.entity) && range.collapsed) {
                    const [_delimiterBefore, delimiterAfter] = getDelimitersFromReadOnlyEntity(
                        event.entity
                    );

                    if (delimiterAfter) {
                        let nodeToSelect = delimiterAfter.wrapper.nextSibling;
                        if (!nodeToSelect) {
                            nodeToSelect = this.insertNode(
                                NBSP,
                                delimiterAfter.wrapper,
                                'afterend'
                            );
                        }

                        if (nodeToSelect) {
                            this.editor.select(createRange(nodeToSelect, 1));
                        }
                    }
                }
            }
        }

        if (
            (event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.KeyUp) &&
            isCharacterValue(event.rawEvent)
        ) {
            const position = this.editor.getFocusedPosition();

            const entityAtCursor = this.editor.getElementAtCursor(
                getEntitySelector(),
                position.element
            );
            const delimiter = isDelimiter(entityAtCursor);

            if (delimiter) {
                const [delimiterType, entity] = delimiter;
                if (delimiterType == DelimiterType.After) {
                    entity.wrapper.normalize();
                    const textNode = entity.wrapper.firstChild as Node;
                    if (textNode.nodeType == NodeType.Text) {
                        const index = textNode.nodeValue.indexOf(ZERO_WIDTH_SPACE);
                        const text = splitTextNode(
                            <Text>textNode,
                            index + 1,
                            false /* returnFirstPart */
                        );
                        console.log(index);
                        console.log(text);
                        splitParentNode(text, true);
                        this.editor.getElementAtCursor('span', text)?.removeAttribute('class');
                        this.editor.getDocument().getSelection().setPosition(text, 1);
                    }
                } else if (delimiterType == DelimiterType.Before) {
                    entity.wrapper.normalize();
                    const textNode = entity.wrapper.firstChild as Node;
                    if (textNode.nodeType == NodeType.Text) {
                        this.editor.getDocument().getSelection().setPosition(textNode, 0);

                        this.editor.runAsync(() => {
                            const index = textNode.nodeValue.indexOf(ZERO_WIDTH_SPACE);
                            const text = splitTextNode(
                                <Text>textNode,
                                index,
                                true /* returnFirstPart */
                            );
                            entity.wrapper.parentElement.insertBefore(text, entity.wrapper);
                        });
                    }
                }
            }
        }
    }

    private triggerEntityEvent(
        entity: Entity,
        event: EntityOperationEvent,
        deletedFromBefore: boolean = false
    ) {
        const elBetweenDelimiter = deletedFromBefore
            ? entity.wrapper.nextElementSibling
            : entity.wrapper.previousElementSibling;
        if (elBetweenDelimiter && safeInstanceOf(elBetweenDelimiter, 'HTMLElement')) {
            const entityBetweenDelimiter = getEntityFromElement(elBetweenDelimiter);
            if (entityBetweenDelimiter) {
                this.editor.triggerPluginEvent(event.eventType, {
                    operation: event.operation,
                    eventDataCache: event.eventDataCache,
                    rawEvent: event.rawEvent,
                    entity: entityBetweenDelimiter,
                });
            }
        }
    }

    private initCEF() {
        this.editor.addContentEditFeature(this.getF1());
        this.editor.addContentEditFeature(this.getF2());
    }

    //After to Before
    private getF1 = (): GenericContentEditFeature<PluginKeyboardEvent> => {
        return {
            keys: [Keys.LEFT],
            shouldHandleEvent(event: PluginKeyDownEvent, editor: IEditor) {
                const position = editor.getFocusedPosition();

                const entityAtCursor = editor.getElementAtCursor(
                    getEntitySelector(),
                    position.element
                );
                let delimiter: [DelimiterType, Entity];

                return (
                    entityAtCursor &&
                    (delimiter = isDelimiter(entityAtCursor)) &&
                    delimiter[0] == DelimiterType.After &&
                    cacheDelimiter(event, delimiter[1])
                );
            },
            handleEvent(event: PluginKeyDownEvent, editor: IEditor) {
                const entity = cacheDelimiter(event);
                const id = entity.id;
                const idBefore = id.substring(0, id.indexOf('_')) + DELIMITER_BEFORE;
                const elBefore = editor.queryElements(getEntitySelector(idBefore))[0];

                if (elBefore) {
                    const selection = elBefore.ownerDocument.getSelection();

                    editor.runAsync(() => {
                        if (event.rawEvent.shiftKey) {
                            selection.extend(elBefore, 0);
                            event.rawEvent.preventDefault();
                        } else {
                            selection.setPosition(elBefore, 0);
                            event.rawEvent.preventDefault();
                        }
                    });
                }
            },
        };
    };

    // Before to after
    private getF2 = (): GenericContentEditFeature<PluginKeyboardEvent> => {
        return {
            keys: [Keys.RIGHT],
            shouldHandleEvent(event: PluginKeyDownEvent, editor: IEditor) {
                const position = editor.getFocusedPosition();
                let delimiter: [DelimiterType, Entity];
                position.element.normalize();
                if (position.isAtEnd && position.node.nextSibling) {
                    const elAtCursor = editor.getElementAtCursor(
                        getEntitySelector(),
                        position.node.nextSibling
                    );

                    return (
                        elAtCursor &&
                        (delimiter = isDelimiter(elAtCursor))?.[0] == DelimiterType.Before &&
                        !!cacheDelimiter(event, delimiter[1])
                    );
                }

                const entityAtCursor = editor.getElementAtCursor(
                    getEntitySelector(),
                    position.element
                );

                return (
                    entityAtCursor &&
                    (delimiter = isDelimiter(entityAtCursor)) &&
                    delimiter[0] == DelimiterType.Before &&
                    cacheDelimiter(event, delimiter[1])
                );
            },
            handleEvent(event: PluginKeyDownEvent, editor: IEditor) {
                const entity = cacheDelimiter(event);
                const id = entity.id;

                const idAfter = id.substring(0, id.indexOf('_')) + DELIMITER_AFTER;
                const elAfter = editor.queryElements(getEntitySelector(idAfter))[0];

                if (elAfter) {
                    editor.runAsync(() => {
                        if (event.rawEvent.shiftKey) {
                            const selection = elAfter.ownerDocument.getSelection();
                            selection.extend(elAfter, 1);
                            event.rawEvent.preventDefault();
                        } else {
                            editor.select(new Position(elAfter, PositionType.After));
                            event.rawEvent.preventDefault();
                        }
                    });
                }
            },
        };
    };

    private insertNode(
        text: string,
        scopeElement: HTMLElement,
        afterEnd: InsertPosition
    ): HTMLElement {
        const span = this.editor.getDocument().createElement('span');
        span.textContent = text;
        return scopeElement.insertAdjacentElement(afterEnd, span) as HTMLElement;
    }
}

function getDelimiter(entityWrapper: HTMLElement, after: boolean): HTMLElement | undefined {
    const el = after ? entityWrapper.nextElementSibling : entityWrapper.previousElementSibling;
    return el &&
        matchesSelector(el, `[class*=${after ? DELIMITER_AFTER : DELIMITER_BEFORE}]`) &&
        safeInstanceOf(el, 'HTMLElement')
        ? el
        : undefined;
}

function removeDelimiters(entityWrapper: HTMLElement): void {
    let el: HTMLElement | undefined = undefined;
    if ((el = getDelimiter(entityWrapper, true /* after */))) {
        el.parentElement.removeChild(el);
    }
    if ((el = getDelimiter(entityWrapper, false /* after */))) {
        el.parentElement.removeChild(el);
    }
}

function isReadOnly(entity: Entity) {
    return (
        entity.isReadonly &&
        !isBlockElement(entity.wrapper) &&
        safeInstanceOf(entity.wrapper, 'HTMLElement')
    );
}

function isDelimiter(ent: Element | Entity | null | undefined): [DelimiterType, Entity] | null {
    if (!ent) {
        return;
    }
    let entity: Entity = (<Entity>ent).wrapper
        ? <Entity>ent
        : getEntityFromElement(<HTMLElement>ent);
    if (entity) {
        const id = entity.id;
        if (id.indexOf(DELIMITER_AFTER) > -1) {
            return [DelimiterType.After, entity];
        }
        if (id.indexOf(DELIMITER_BEFORE) > -1) {
            return [DelimiterType.Before, entity];
        }
    }
    return null;
}

function getDelimitersFromReadOnlyEntity(entity: Entity): [Entity | undefined, Entity | undefined] {
    const wrapper = entity.wrapper;
    return [
        isDelimiter(wrapper.previousElementSibling)?.[1],
        isDelimiter(wrapper.nextElementSibling)?.[1],
    ];
}

function cacheDelimiter(event: PluginEvent, delimiter?: Entity) {
    return cacheGetEventData(event, 'delimiter_cache_key', () => delimiter);
}

function isBetweenDelimiter(element: HTMLElement): boolean {
    return !!(
        isDelimiter(element.nextElementSibling) && isDelimiter(element.previousElementSibling)
    );
}
