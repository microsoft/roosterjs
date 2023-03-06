import {
    DelimiterClasses,
    IEditor,
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
            removeInvalidDelimiters(editor.queryElements(DELIMITER_SELECTOR));
            addDelimitersIfNeeded(editor.queryElements(INLINE_ENTITY_SELECTOR));
            break;

        case PluginEventType.BeforePaste:
            addDelimitersIfNeeded(event.fragment.querySelectorAll(INLINE_ENTITY_SELECTOR));
            break;

        case PluginEventType.ExtractContentWithDom:
        case PluginEventType.BeforeCutCopy:
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(node => {
                node.parentElement?.removeChild(node);
            });
            break;

        case PluginEventType.KeyDown:
            const range = editor.getSelectionRangeEx();
            if (
                range.type == SelectionRangeTypes.Normal &&
                range.areAllCollapsed &&
                isCharacterValue(event.rawEvent)
            ) {
                const position = editor.getFocusedPosition();

                if (!position) {
                    return;
                }

                const delimiter = editor.getElementAtCursor(DELIMITER_SELECTOR, position.element);

                if (
                    !delimiter ||
                    (!delimiter.classList.contains(DelimiterClasses.DELIMITER_AFTER) &&
                        !delimiter.classList.contains(DelimiterClasses.DELIMITER_BEFORE))
                ) {
                    return;
                }

                delimiter.normalize();
                const textNode = delimiter.firstChild as Node;
                if (textNode?.nodeType == NodeType.Text) {
                    editor.runAsync(() => {
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
                    });
                }
            }
    }
}

function getDelimiters(entityWrapper: HTMLElement): (HTMLElement | undefined)[] {
    return [entityWrapper.nextElementSibling, entityWrapper.previousElementSibling].map(el =>
        el && safeInstanceOf(el, 'HTMLElement') && getDelimiterFromElement(el) ? el : undefined
    );
}

function addDelimitersIfNeeded(nodes: Element[] | NodeListOf<Element>) {
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

function removeInvalidDelimiters(nodes: Element[]) {
    nodes.forEach(node => {
        const sibling = node.classList.contains(DelimiterClasses.DELIMITER_AFTER)
            ? node.nextElementSibling
            : node.previousElementSibling;
        if (
            getDelimiterFromElement(node) &&
            !!(safeInstanceOf(sibling, 'HTMLElement') && getEntityFromElement(sibling))
        ) {
            removeNode(node);
        } else {
            node?.classList.remove(
                DelimiterClasses.DELIMITER_BEFORE,
                DelimiterClasses.DELIMITER_AFTER
            );
        }
    });
}
