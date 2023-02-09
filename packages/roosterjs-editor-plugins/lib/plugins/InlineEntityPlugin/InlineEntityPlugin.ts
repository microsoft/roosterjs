import { insertEntity } from 'roosterjs-editor-api/lib';
import {
    cacheGetEventData,
    createRange,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    matchesSelector,
    Position,
    safeInstanceOf,
    unwrap,
} from 'roosterjs-editor-dom/lib';
import {
    EditorPlugin,
    Entity,
    EntityOperation,
    GenericContentEditFeature,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
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
    private delimitersBefore: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    private delimitersAfter: Map<string, HTMLElement> = new Map<string, HTMLElement>();
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
                const { wrapper, id, type } = event.entity;
                if (isReadOnly(event.entity)) {
                    const element = wrapper as HTMLElement;

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
                    const selector = getEntitySelector(id, type);
                    this.delimitersBefore.set(selector, elementBefore);
                    this.delimitersAfter.set(selector, elementAfter);

                    this.id++;

                    insertEntity(
                        this.editor,
                        this.id + DELIMITER_BEFORE,
                        elementBefore,
                        false,
                        false,
                        Position.getStart(createRange(elementBefore)),
                        false
                    );

                    const entityAfter = insertEntity(
                        this.editor,
                        this.id + DELIMITER_AFTER,
                        elementAfter,
                        false,
                        false,
                        Position.getStart(createRange(elementAfter)),
                        false
                    );

                    unwrap(elementAfter);
                    unwrap(elementBefore);
                    this.editor.select(createRange(entityAfter.wrapper, 1));
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

                    if (
                        entity.wrapper.textContent.length == 1 &&
                        entity.wrapper.textContent == ZERO_WIDTH_SPACE
                    ) {
                        if (delimiterType == DelimiterType.After) {
                            const idBefore = id.substring(0, id.indexOf('_')) + DELIMITER_BEFORE;
                            const elBefore = this.editor.queryElements(
                                getEntitySelector(idBefore)
                            )[0];

                            if (elBefore) {
                                this.editor.select(
                                    createRange(
                                        new Position(elBefore, 0),
                                        new Position(entity.wrapper, PositionType.After)
                                    )
                                );
                            }
                        } else if (delimiterType == DelimiterType.Before) {
                            const idAfter = id.substring(0, id.indexOf('_')) + DELIMITER_AFTER;
                            const elAfter = this.editor.queryElements(
                                getEntitySelector(idAfter)
                            )[0];

                            if (elAfter) {
                                this.editor.select(
                                    createRange(
                                        new Position(entity.wrapper, PositionType.Before),
                                        new Position(elAfter, 0)
                                    )
                                );
                            }
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

        // if (event.eventType == PluginEventType.KeyDown) {
        //     const position = this.editor.getFocusedPosition();

        //     const entityAtCursor = this.editor.getElementAtCursor(
        //         getEntitySelector(),
        //         position.element
        //     );
        //     const delimiter = isDelimiter(entityAtCursor);

        //     if (delimiter) {
        //         const [delimiterType, entity] = delimiter;
        //         const id = entity.id;

        //         if (
        //             entity.wrapper.textContent.length == 1 &&
        //             entity.wrapper.textContent == ZERO_WIDTH_SPACE
        //         ) {
        //             if (delimiterType == DelimiterType.After) {
        //                 const idBefore = id.substring(0, id.indexOf('_')) + DELIMITER_BEFORE;
        //                 const elBefore = this.editor.queryElements(getEntitySelector(idBefore))[0];

        //                 if (elBefore) {
        //                     this.editor.select(
        //                         createRange(
        //                             new Position(elBefore, 0),
        //                             new Position(entity.wrapper, PositionType.After)
        //                         )
        //                     );
        //                 }
        //             } else if (delimiterType == DelimiterType.Before) {
        //                 const idAfter = id.substring(0, id.indexOf('_')) + DELIMITER_AFTER;
        //                 const elAfter = this.editor.queryElements(getEntitySelector(idAfter))[0];

        //                 if (elAfter) {
        //                     this.editor.select(
        //                         createRange(
        //                             new Position(entity.wrapper, PositionType.Before),
        //                             new Position(elAfter, 0)
        //                         )
        //                     );
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    private initCEF() {
        this.editor.addContentEditFeature(this.getF1());
        this.editor.addContentEditFeature(this.getF2());
    }

    //After to Before
    private getF1 = (): GenericContentEditFeature<PluginKeyboardEvent> => {
        return {
            handleEvent(event, editor) {
                console.log(cacheDelimiter(event));
                const entity = cacheDelimiter(event);
                const id = entity.id;
                const idBefore = id.substring(0, id.indexOf('_')) + DELIMITER_BEFORE;
                const elBefore = editor.queryElements(getEntitySelector(idBefore))[0];

                if (elBefore) {
                    if (event.rawEvent.shiftKey) {
                        const selection = elBefore.ownerDocument.getSelection();
                        selection.extend(elBefore, 0);
                        event.rawEvent.preventDefault();
                    } else {
                        const traverser = editor.getSelectionTraverser(
                            createRange(
                                new Position(elBefore, 0),
                                new Position(entity.wrapper, PositionType.End)
                            )
                        );

                        let currentInline = traverser.currentInlineElement;
                        while (traverser.currentInlineElement) {
                            const temp = traverser.getPreviousInlineElement();

                            if (currentInline == temp) {
                                break;
                            }
                        }
                        editor.select(
                            createRange(
                                new Position(elBefore, 0),
                                new Position(entity.wrapper, PositionType.End)
                            )
                        );
                    }
                }
            },
            shouldHandleEvent(event, editor, ctrlOrMeta) {
                const position = editor.getFocusedPosition();

                if (position.offset == 1 && position.node.previousSibling) {
                    const elAtCursor = editor.getElementAtCursor(
                        getEntitySelector(),
                        position.node.previousSibling
                    );

                    const delimiter = isDelimiter(elAtCursor)?.[1];
                    if (!!cacheDelimiter(event, delimiter)) {
                        return true;
                    }
                }

                if (position.offset == 0) {
                    const entityAtCursor = editor.getElementAtCursor(
                        getEntitySelector(),
                        position.element
                    );
                    const delimiter = isDelimiter(entityAtCursor);

                    return (
                        delimiter &&
                        delimiter[0] == DelimiterType.After &&
                        cacheDelimiter(event, delimiter[1])
                    );
                }

                return false;
            },
            keys: [Keys.LEFT],
            allowFunctionKeys: false,
        };
    };

    // Before to after
    private getF2 = (): GenericContentEditFeature<PluginKeyboardEvent> => {
        return {
            handleEvent(event, editor) {
                const entity = cacheDelimiter(event);
                const id = entity.id;

                const idAfter = id.substring(0, id.indexOf('_')) + DELIMITER_AFTER;
                const elAfter = editor.queryElements(getEntitySelector(idAfter))[0];

                if (elAfter) {
                    if (event.rawEvent.shiftKey) {
                        const selection = elAfter.ownerDocument.getSelection();
                        selection.extend(elAfter, 1);
                        event.rawEvent.preventDefault();
                    } else {
                        editor.select(
                            createRange(
                                new Position(entity.wrapper, PositionType.End),
                                new Position(elAfter, 1)
                            )
                        );
                    }
                }
            },
            shouldHandleEvent(event, editor, ctrlOrMeta) {
                const position = editor.getFocusedPosition();

                if (position.isAtEnd && position.node.nextSibling) {
                    const elAtCursor = editor.getElementAtCursor(
                        getEntitySelector(),
                        position.node.nextSibling
                    );

                    const delimiter = isDelimiter(elAtCursor)?.[1];
                    return !!cacheDelimiter(event, delimiter);
                }

                const entityAtCursor = editor.getElementAtCursor(
                    getEntitySelector(),
                    position.element
                );
                const delimiter = isDelimiter(entityAtCursor);

                return (
                    delimiter &&
                    delimiter[0] == DelimiterType.Before &&
                    cacheDelimiter(event, delimiter[1])
                );
            },
            keys: [Keys.RIGHT],
            allowFunctionKeys: false,
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

// function getEndOffset(node: Node): number {
//     if (node.nodeType == NodeType.Text) {
//         return node.nodeValue?.length || 0;
//     } else if (node.nodeType == NodeType.Element || node.nodeType == NodeType.DocumentFragment) {
//         return node.childNodes.length;
//     } else {
//         return 1;
//     }
// }

function cacheDelimiter(event: PluginEvent, delimiter?: Entity) {
    return cacheGetEventData(event, 'delimiter_cache_key', () => delimiter);
}
