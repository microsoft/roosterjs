import { isCharacterValue } from 'roosterjs-content-model-core';
import {
    addDelimiters,
    isBlockElement,
    isEntityElement,
    isNodeOfType,
} from 'roosterjs-content-model-dom';
import {
    DelimiterClasses,
    Keys,
    NodeType,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    Position,
    createRange,
    getDelimiterFromElement,
    getEntityFromElement,
    getEntitySelector,
    matchesSelector,
    splitTextNode,
} from 'roosterjs-editor-dom';
import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginKeyDownEvent,
} from 'roosterjs-editor-types';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;
const ZERO_WIDTH_SPACE = '\u200B';
const INLINE_ENTITY_SELECTOR = 'span' + getEntitySelector();

/**
 * @internal
 * Entity delimiter plugin helps maintain delimiter elements around an entity so that user can put focus before/after an entity
 */
class EntityDelimiterPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'EntityDelimiter';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.ContentChanged:
                case PluginEventType.EditorReady:
                    normalizeDelimitersInEditor(this.editor);
                    break;

                case PluginEventType.BeforePaste:
                    const { fragment } = event;
                    addDelimitersIfNeeded(fragment.querySelectorAll(INLINE_ENTITY_SELECTOR));

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
                    handleKeyDownEvent(this.editor, event);
                    break;
            }
        }
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
        if (
            isNodeOfType(node, 'ELEMENT_NODE') &&
            isEntityElement(node) &&
            !node.isContentEditable
        ) {
            addDelimiters(node.ownerDocument, node as HTMLElement);
        }
    });
}

function removeNode(el: Node | undefined | null) {
    el?.parentElement?.removeChild(el);
}

function removeInvalidDelimiters(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (getDelimiterFromElement(node)) {
            const sibling = node.classList.contains(DelimiterClasses.DELIMITER_BEFORE)
                ? node.nextElementSibling
                : node.previousElementSibling;
            if (!(isNodeOfType(sibling, 'ELEMENT_NODE') && getEntityFromElement(sibling))) {
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
        if (blockToCheck && isNodeOfType(blockToCheck, 'ELEMENT_NODE')) {
            const delimiters = blockToCheck.querySelectorAll(DELIMITER_SELECTOR);
            // Check if the last or first delimiter still contain the delimiter class and remove it.
            const delimiterToCheck = delimiters.item(isAfter ? 0 : delimiters.length - 1);
            removeDelimiterAttr(delimiterToCheck);
        }

        if (entity && isEntityElement(entity)) {
            const entityElement = entity as HTMLElement;
            const { nextElementSibling, previousElementSibling } = entityElement;
            [nextElementSibling, previousElementSibling].forEach(el => {
                // Check if after Enter the ZWS got removed but we still have a element with the class
                // Remove the attributes of the element if it is invalid now.
                if (el && matchesSelector(el, DELIMITER_SELECTOR) && !getDelimiterFromElement(el)) {
                    removeDelimiterAttr(el, false /* checkEntity */);
                }
            });

            // Add delimiters to the entity if needed because on Enter we can sometimes lose the ZWS of the element.
            addDelimiters(entityElement.ownerDocument, entityElement);
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

    while (block && (!isNodeOfType(block, 'ELEMENT_NODE') || !isBlockElement(block))) {
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

/**
 * @internal
 * Create a new instance of EntityDelimiterPlugin.
 */
export function createEntityDelimiterPlugin(): EditorPlugin {
    return new EntityDelimiterPlugin();
}
