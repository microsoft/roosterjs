import {
    DelimiterClasses,
    IEditor,
    Keys,
    NodeType,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    addDelimiterAfter,
    addDelimiterBefore,
    getDelimiterFromElement,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    isCharacterValue,
    Position,
    safeInstanceOf,
    splitTextNode,
    toArray,
} from 'roosterjs-editor-dom';
import type { Entity, PluginEvent } from 'roosterjs-editor-types';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;
const ZERO_WIDTH_SPACE = '\u200B';
const INLINE_ENTITY_SELECTOR = 'span' + getEntitySelector();

export function inlineEntityOnPluginEvent(event: PluginEvent, editor: IEditor) {
    switch (event.eventType) {
        case PluginEventType.ContentChanged:
        case PluginEventType.EditorReady:
            removeOrphanedDelimiters(editor.queryElements(DELIMITER_SELECTOR));
            addDelimitersIfNeeded(editor.queryElements(INLINE_ENTITY_SELECTOR));
            break;

        case PluginEventType.BeforePaste:
            addDelimitersInElement(event.fragment);
            break;

        case PluginEventType.ExtractContentWithDom:
        case PluginEventType.BeforeCutCopy:
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(removeNode);
            break;

        case PluginEventType.KeyDown:
            const range = editor.getSelectionRangeEx();
            const { rawEvent } = event;
            if (range.type != SelectionRangeTypes.Normal) {
                return;
            }

            if (
                range.areAllCollapsed &&
                (isCharacterValue(rawEvent) || rawEvent.which === Keys.ENTER)
            ) {
                const position = editor.getFocusedPosition();

                if (!position) {
                    return;
                }

                const elementAtCursor = editor.getElementAtCursor(
                    DELIMITER_SELECTOR,
                    position.element
                );
                const delimiter = getDelimiterFromElement(elementAtCursor);

                if (!delimiter) {
                    // If the element exists but it is not a delimiter, example the text content is not ZWS, remove the classes
                    if (elementAtCursor) {
                        removeDelimiterClasses(elementAtCursor);
                    }
                    return;
                }

                delimiter.normalize();
                const textNode = delimiter.firstChild as Node;
                if (textNode?.nodeType == NodeType.Text) {
                    const blockBeforeEnter = editor.getBlockElementAtNode(delimiter);
                    editor.runAsync((asyncEditor: IEditor) => {
                        const index = textNode.nodeValue?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
                        if (index >= 0) {
                            splitTextNode(
                                <Text>textNode,
                                index == 0 ? 1 : index,
                                false /* returnFirstPart */
                            );
                            let nodeToMove: Node | undefined;
                            delimiter.childNodes.forEach(node => {
                                if (node.nodeValue !== ZERO_WIDTH_SPACE) {
                                    nodeToMove = node;
                                }
                            });
                            if (nodeToMove) {
                                delimiter.parentElement?.insertBefore(
                                    nodeToMove,
                                    delimiter.className == DelimiterClasses.DELIMITER_BEFORE
                                        ? delimiter
                                        : delimiter.nextSibling
                                );
                                const selection = nodeToMove.ownerDocument?.getSelection();

                                if (selection) {
                                    selection.setPosition(
                                        nodeToMove,
                                        new Position(nodeToMove, PositionType.End).offset
                                    );
                                }
                            }
                        }

                        if (event.rawEvent.which === Keys.ENTER) {
                            const element = editor.getFocusedPosition()?.element;
                            const block = element && asyncEditor.getBlockElementAtNode(element);
                            [blockBeforeEnter, block].forEach(block =>
                                normalizeDelimiters(block?.getStartNode())
                            );
                        }
                    });
                }
            } else if (!range.areAllCollapsed) {
                const range = editor.getSelectionRange();
                const containers = [range?.startContainer, range?.endContainer].map(
                    node => node && editor.getBlockElementAtNode(node)?.getStartNode()
                );
                editor.runAsync(() => containers.forEach(normalizeDelimiters));
            }
    }
}

function normalizeDelimiters(container: Node | undefined) {
    if (container && safeInstanceOf(container, 'HTMLElement')) {
        removeOrphanedDelimiters(toArray(container.querySelectorAll(DELIMITER_SELECTOR)));
        addDelimitersInElement(container);
    }
}

function addDelimitersInElement(fragment: HTMLElement | DocumentFragment) {
    addDelimitersIfNeeded(toArray(fragment.querySelectorAll(INLINE_ENTITY_SELECTOR)));
}

function getDelimiters(entityWrapper: HTMLElement): (HTMLElement | undefined)[] {
    return [entityWrapper.nextElementSibling, entityWrapper.previousElementSibling].map(el =>
        el && safeInstanceOf(el, 'HTMLElement') && getDelimiterFromElement(el) ? el : undefined
    );
}

function addDelimitersIfNeeded(nodes: Element[]) {
    nodes.forEach(node => {
        if (safeInstanceOf(node, 'HTMLElement') && isReadOnly(getEntityFromElement(node))) {
            const [delimiterAfter, delimiterBefore] = getDelimiters(node);

            if (!delimiterAfter) {
                addDelimiterAfter(node);
            }
            if (!delimiterBefore) {
                addDelimiterBefore(node);
            }
        }
    });
}

function removeNode(el: Node | undefined) {
    el?.parentElement?.removeChild(el);
}

function isReadOnly(entity: Entity | null) {
    return (
        entity?.isReadonly &&
        !isBlockElement(entity.wrapper) &&
        safeInstanceOf(entity.wrapper, 'HTMLElement')
    );
}

function tryGetEntity(node: Element | null): boolean {
    return !!(safeInstanceOf(node, 'HTMLElement') && getEntityFromElement(node));
}

function removeOrphanedDelimiters(nodes: Element[]) {
    nodes.forEach(node => {
        if (
            getDelimiterFromElement(node) &&
            !tryGetEntity(
                node.classList.contains(DelimiterClasses.DELIMITER_AFTER)
                    ? node.nextElementSibling
                    : node.previousElementSibling
            )
        ) {
            removeNode(node);
        } else {
            removeDelimiterClasses(node);
        }
    });
}

function removeDelimiterClasses(node: Element | undefined) {
    node?.classList.remove(DelimiterClasses.DELIMITER_BEFORE, DelimiterClasses.DELIMITER_AFTER);
}
