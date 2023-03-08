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
    isModifierKey,
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
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(removeNode);
            break;

        case PluginEventType.KeyDown:
            const rangeEx = editor.getSelectionRangeEx();
            const { rawEvent } = event;
            if (rangeEx.type != SelectionRangeTypes.Normal) {
                return;
            }

            if (
                rangeEx.areAllCollapsed &&
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

                const delimiter = editor.getElementAtCursor(DELIMITER_SELECTOR, refNode);

                if (!delimiter) {
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

                    editor.select(positionToUse);

                    editor.runAsync(aEditor => handleEnterAsync(isAfter, aEditor, element));
                } else if (delimiter.firstChild?.nodeType == NodeType.Text) {
                    editor.runAsync(() => preventTypeInDelimiter(delimiter));
                }
            } else if (!rangeEx.areAllCollapsed && !isModifierKey(rawEvent) && !rawEvent.shiftKey) {
                const range = rangeEx.ranges[0];
                if (!range) {
                    return;
                }

                const startContainer = editor.getElementAtCursor(
                    DELIMITER_SELECTOR,
                    range.startContainer
                );
                const endContainer = editor.getElementAtCursor(
                    DELIMITER_SELECTOR,
                    range.endContainer
                );

                const getPosition = (container: HTMLElement | null, isStartContainer: boolean) => {
                    if (container && getDelimiterFromElement(container)) {
                        const isAfter = container.classList.contains(
                            DelimiterClasses.DELIMITER_AFTER
                        );
                        return new Position(
                            container,
                            !isAfter && !isStartContainer ? PositionType.Before : PositionType.After
                        );
                    }
                    return undefined;
                };

                const startUpdate = getPosition(startContainer, true /* isStartContainer */);
                const endUpdate = getPosition(endContainer, false /* isStartContainer */);

                if (startUpdate || endUpdate) {
                    editor.select(
                        startUpdate ?? new Position(range.startContainer, range.startOffset),
                        endUpdate ?? new Position(range.endContainer, range.endOffset)
                    );
                }
                editor.runAsync(aEditor => {
                    const delimiter = aEditor.getElementAtCursor(DELIMITER_SELECTOR);
                    if (delimiter) {
                        preventTypeInDelimiter(delimiter);
                    }
                });
            }
            break;
    }
}

function handleEnterAsync(isAfter: boolean, asyncEditor: IEditor, element: Element | null = null) {
    if (isAfter) {
        const elAfter = asyncEditor.getElementAtCursor();
        removeDelimiterAttr(elAfter);
    }
    if (element) {
        removeNode(element);
    }
}

function preventTypeInDelimiter(delimiter: HTMLElement) {
    delimiter.normalize();
    const textNode = delimiter.firstChild as Node;
    const index = textNode.nodeValue?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
    if (index >= 0) {
        splitTextNode(<Text>textNode, index == 0 ? 1 : index, false /* returnFirstPart */);
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
        if (tryGetEntityFromNode(node)) {
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

function tryGetEntityFromNode(node: Element | null): node is HTMLElement {
    return !!(
        node &&
        safeInstanceOf(node, 'HTMLElement') &&
        isReadOnly(getEntityFromElement(node))
    );
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
