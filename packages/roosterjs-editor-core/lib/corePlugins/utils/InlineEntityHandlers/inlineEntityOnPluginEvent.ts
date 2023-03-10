import {
    ChangeSource,
    DelimiterClasses,
    IEditor,
    Keys,
    NodeType,
    PluginEventType,
    PluginKeyDownEvent,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    addDelimiters,
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
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(removeNode);
            break;

        case PluginEventType.KeyDown:
            handleKeyDownEvent(editor, event);
            break;
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

export function normalizeDelimitersInEditor(editor: IEditor) {
    removeInvalidDelimiters(editor.queryElements(DELIMITER_SELECTOR));
    addDelimitersIfNeeded(editor.queryElements(INLINE_ENTITY_SELECTOR));
}

function addDelimitersIfNeeded(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (tryGetEntityFromNode(node)) {
            addDelimiters(node);
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

function removeNode(el: Node | undefined | null) {
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
    if (!node) {
        return;
    }

    const isAfter = node.classList.contains(DelimiterClasses.DELIMITER_AFTER);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (entitySibling && tryGetEntityFromNode(entitySibling)) {
        return;
    }

    node.classList.remove(DelimiterClasses.DELIMITER_AFTER, DelimiterClasses.DELIMITER_BEFORE);

    node.normalize();
    node.childNodes.forEach(cn => {
        const index = cn.textContent?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
        if (index >= 0) {
            createRange(cn, index, cn, index + 1)?.deleteContents();
        }
    });
}

function handleCollapsedEnter(editor: IEditor, delimiter: HTMLElement) {
    const isAfter = delimiter.classList.contains(DelimiterClasses.DELIMITER_AFTER);
    const sibling = isAfter ? delimiter.nextSibling : delimiter.previousSibling;
    let positionToUse: Position | undefined;
    let element: Element | null;

    if (sibling) {
        positionToUse = new Position(sibling, isAfter ? PositionType.Begin : PositionType.End);
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
        editor.runAsync(aEditor => {
            const elAfter = aEditor.getElementAtCursor();
            removeDelimiterAttr(elAfter);
            removeNode(element);
        });
    }
}

const getPosition = (container: HTMLElement | null) => {
    if (container && getDelimiterFromElement(container)) {
        const isAfter = container.classList.contains(DelimiterClasses.DELIMITER_AFTER);
        return new Position(container, isAfter ? PositionType.After : PositionType.Before);
    }
    return undefined;
};

function handleSelectionNotCollapsed(editor: IEditor, range: Range, event: KeyboardEvent) {
    const { startContainer, endContainer, startOffset, endOffset } = range;

    const startElement = editor.getElementAtCursor(DELIMITER_SELECTOR, startContainer);
    const endElement = editor.getElementAtCursor(DELIMITER_SELECTOR, endContainer);

    const startUpdate = getPosition(startElement);
    const endUpdate = getPosition(endElement);

    if (startUpdate || endUpdate) {
        editor.select(
            startUpdate ?? new Position(startContainer, startOffset),
            endUpdate ?? new Position(endContainer, endOffset)
        );
    }
    editor.runAsync(aEditor => {
        const delimiter = aEditor.getElementAtCursor(DELIMITER_SELECTOR);
        if (delimiter) {
            preventTypeInDelimiter(delimiter);
            if (event.which === Keys.ENTER) {
                removeDelimiterAttr(delimiter);
            }
        }
    });
}

function handleKeyDownEvent(editor: IEditor, event: PluginKeyDownEvent) {
    const range = editor.getSelectionRangeEx();
    const { rawEvent } = event;
    if (range.type != SelectionRangeTypes.Normal) {
        return;
    }

    if (range.areAllCollapsed && (isCharacterValue(rawEvent) || rawEvent.which === Keys.ENTER)) {
        const position = editor.getFocusedPosition()?.normalize();
        if (!position) {
            return;
        }

        const { element, node } = position;
        const refNode = element == node ? element.childNodes.item(position.offset) : element;

        const delimiter = editor.getElementAtCursor(DELIMITER_SELECTOR, refNode);
        if (!delimiter) {
            return;
        }

        if (rawEvent.which === Keys.ENTER) {
            handleCollapsedEnter(editor, delimiter);
        } else if (delimiter.firstChild?.nodeType == NodeType.Text) {
            editor.runAsync(() => preventTypeInDelimiter(delimiter));
        }
    } else if (!range.areAllCollapsed && !rawEvent.shiftKey && rawEvent.which != Keys.SHIFT) {
        const currentRange = range.ranges[0];
        if (!currentRange) {
            return;
        }
        handleSelectionNotCollapsed(editor, currentRange, rawEvent);
    }
}
