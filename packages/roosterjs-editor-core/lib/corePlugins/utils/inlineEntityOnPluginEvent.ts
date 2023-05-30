import {
    addDelimiters,
    arrayPush,
    createRange,
    getDelimiterFromElement,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    isCharacterValue,
    matchesSelector,
    Position,
    safeInstanceOf,
    splitTextNode,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    DelimiterClasses,
    Entity,
    IEditor,
    Keys,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;
const ZERO_WIDTH_SPACE = '\u200B';
const INLINE_ENTITY_SELECTOR = 'span' + getEntitySelector();

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
            const { fragment, sanitizingOption } = event;
            addDelimitersIfNeeded(fragment.querySelectorAll(INLINE_ENTITY_SELECTOR));

            if (sanitizingOption.additionalAllowedCssClasses) {
                arrayPush(sanitizingOption.additionalAllowedCssClasses, [
                    DelimiterClasses.DELIMITER_AFTER,
                    DelimiterClasses.DELIMITER_BEFORE,
                ]);
            }
            break;

        case PluginEventType.ExtractContentWithDom:
        case PluginEventType.BeforeCutCopy:
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(node => {
                if (getDelimiterFromElement(node)) {
                    removeNode(node);
                } else {
                    removeDelimiterAttr(node);
                }
            });
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

/**
 * @internal
 */
export function normalizeDelimitersInEditor(editor: IEditor) {
    removeInvalidDelimiters(editor.queryElements(DELIMITER_SELECTOR));
    addDelimitersIfNeeded(editor.queryElements(INLINE_ENTITY_SELECTOR));
}

function addDelimitersIfNeeded(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (isEntityElement(node)) {
            addDelimiters(node);
        }
    });
}

function isEntityElement(node: Node | null): node is HTMLElement {
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

function removeInvalidDelimiters(nodes: Element[] | NodeListOf<Element>) {
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

function removeDelimiterAttr(node: Element | undefined | null, checkEntity: boolean = true) {
    if (!node) {
        return;
    }

    const isAfter = node.classList.contains(DelimiterClasses.DELIMITER_AFTER);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (checkEntity && entitySibling && isEntityElement(entitySibling)) {
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
    const entity = !isAfter ? delimiter.nextSibling : delimiter.previousSibling;
    const block = getBlock(editor, delimiter);

    editor.runAsync(() => {
        if (!block) {
            return;
        }
        const blockToCheck = isAfter ? block.nextSibling : block.previousSibling;
        if (blockToCheck && safeInstanceOf(blockToCheck, 'HTMLElement')) {
            const delimiters = blockToCheck.querySelectorAll(DELIMITER_SELECTOR);
            // Check if the last or first delimiter still contain the delimiter class and remove it.
            const delimiterToCheck = delimiters.item(isAfter ? 0 : delimiters.length - 1);
            removeDelimiterAttr(delimiterToCheck);
        }

        if (isEntityElement(entity)) {
            const { nextElementSibling, previousElementSibling } = entity;
            [nextElementSibling, previousElementSibling].forEach(el => {
                // Check if after Enter the ZWS got removed but we still have a element with the class
                // Remove the attributes of the element if it is invalid now.
                if (el && matchesSelector(el, DELIMITER_SELECTOR) && !getDelimiterFromElement(el)) {
                    removeDelimiterAttr(el, false /* checkEntity */);
                }
            });
            // Add delimiters to the entity if needed because on Enter we can sometimes lose the ZWS of the element.
            addDelimiters(entity);
        }
    });
}

const getPosition = (container: HTMLElement | null) => {
    if (container && getDelimiterFromElement(container)) {
        const isAfter = container.classList.contains(DelimiterClasses.DELIMITER_AFTER);
        return new Position(container, isAfter ? PositionType.After : PositionType.Before);
    }
    return undefined;
};

function getBlock(editor: IEditor, element: Node | undefined) {
    if (!element) {
        return undefined;
    }

    let block = editor.getBlockElementAtNode(element)?.getStartNode();

    while (block && !isBlockElement(block)) {
        block = editor.contains(block.parentElement) ? block.parentElement! : undefined;
    }

    return block;
}

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
