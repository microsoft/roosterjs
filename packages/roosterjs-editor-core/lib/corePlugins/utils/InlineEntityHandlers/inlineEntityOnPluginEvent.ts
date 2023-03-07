import {
    ChangeSource,
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
    createElement,
    createRange,
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
const NBSP = '\u00A0';

export function inlineEntityOnPluginEvent(event: PluginEvent, editor: IEditor) {
    switch (event.eventType) {
        case PluginEventType.ContentChanged:
            if (event.source === ChangeSource.SetContent) {
                normalizeDelimitersInEditor(editor);
            }
            break;
        case PluginEventType.EditorReady:
            normalizeDelimitersInEditor(editor);
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

                const refNode =
                    position.element == position.node
                        ? position.element.childNodes.item(position.offset)
                        : position.element;

                const elementAtCursor = editor.getElementAtCursor(DELIMITER_SELECTOR, refNode);
                const delimiter = getDelimiterFromElement(elementAtCursor);

                if (!delimiter) {
                    // If the element exists but it is not a delimiter, example the text content is not ZWS, remove the classes
                    if (elementAtCursor) {
                        removeDelimiterAttr(elementAtCursor);
                    }
                    return;
                }

                if (rawEvent.which === Keys.ENTER) {
                    const isAfter = delimiter.classList.contains(DelimiterClasses.DELIMITER_AFTER);
                    const sibling = isAfter ? delimiter.nextSibling : delimiter.previousSibling;
                    let positionToUse: Position | undefined;
                    let element: Element | null;

                    if (sibling) {
                        positionToUse = new Position(
                            sibling,
                            isAfter ? PositionType.Begin : PositionType.End
                        );
                    } else {
                        element = delimiter.insertAdjacentElement(
                            isAfter ? 'afterend' : 'beforebegin',
                            createElement(
                                {
                                    tag: 'span',
                                    children: [NBSP],
                                },
                                editor.getDocument()
                            )!
                        );

                        if (!element) {
                            return;
                        }

                        positionToUse = new Position(element, PositionType.Begin);
                    }

                    if (positionToUse) {
                        editor.select(positionToUse);

                        editor.runAsync(asyncEditor => {
                            if (isAfter) {
                                const elAfter = asyncEditor.getElementAtCursor();
                                removeDelimiterAttr(elAfter);
                            }
                            if (element) {
                                removeNode(element);
                            }
                        });
                    }
                } else if (delimiter.firstChild?.nodeType == NodeType.Text) {
                    editor.runAsync(() => {
                        delimiter.normalize();
                        const textNode = delimiter.firstChild as Node;
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

function normalizeDelimitersInEditor(editor: IEditor) {
    removeInvalidDelimiters(editor.queryElements(DELIMITER_SELECTOR));
    addDelimitersIfNeeded(editor.queryElements(INLINE_ENTITY_SELECTOR));
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
        if (getDelimiterFromElement(node)) {
            const sibling = node.classList.contains(DelimiterClasses.DELIMITER_BEFORE)
                ? node.nextElementSibling
                : node.previousElementSibling;
            if (!(safeInstanceOf(sibling, 'HTMLElement') && getEntityFromElement(sibling))) {
                removeNode(node);
            }
        } else {
            removeDelimiterAttr(node);
        }
    });
}

function removeDelimiterAttr(node: Element | undefined | null) {
    node?.classList.remove(DelimiterClasses.DELIMITER_BEFORE, DelimiterClasses.DELIMITER_AFTER);

    node?.normalize();
    node?.childNodes.forEach(cn => {
        const index = cn.textContent?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
        if (index >= 0) {
            createRange(cn, index, cn, index + 1)?.deleteContents();
        }
    });
}
