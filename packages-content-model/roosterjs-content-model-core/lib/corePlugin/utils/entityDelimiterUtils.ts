import { isCharacterValue } from '../../publicApi/domUtils/eventUtils';
import { iterateSelections } from '../../publicApi/selection/iterateSelections';
import type {
    ContentModelBlockGroup,
    ContentModelFormatter,
    ContentModelParagraph,
    IStandaloneEditor,
    KeyDownEvent,
    RangeSelection,
} from 'roosterjs-content-model-types';
import {
    addDelimiters,
    createBr,
    createParagraph,
    isEntityDelimiter,
    isEntityElement,
    isNodeOfType,
} from 'roosterjs-content-model-dom';

const DELIMITER_BEFORE = 'entityDelimiterBefore';
const DELIMITER_AFTER = 'entityDelimiterAfter';
const DELIMITER_SELECTOR = '.' + DELIMITER_AFTER + ',.' + DELIMITER_BEFORE;
const ZERO_WIDTH_SPACE = '\u200B';
const ENTITY_INFO_NAME = '_Entity';
const INLINE_ENTITY_SELECTOR = 'span.' + ENTITY_INFO_NAME;

/**
 * @internal exported only for unit test
 */
export function preventTypeInDelimiter(node: HTMLElement, editor: IStandaloneEditor) {
    const isAfter = node.classList.contains(DELIMITER_AFTER);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (entitySibling && isEntityElement(entitySibling)) {
        removeInvalidDelimiters(
            [entitySibling.previousElementSibling, entitySibling.nextElementSibling].filter(
                element => !!element
            ) as HTMLElement[]
        );
        editor.formatContentModel(model => {
            iterateSelections(model, (_path, _tableContext, block, _segments) => {
                if (block?.blockType == 'Paragraph') {
                    block.segments.forEach(segment => {
                        if (segment.segmentType == 'Text') {
                            segment.text = segment.text.replace(ZERO_WIDTH_SPACE, '');
                        }
                    });
                }
            });
            return true;
        });
    }
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
        if (isEntityDelimiter(node)) {
            const sibling = node.classList.contains(DELIMITER_BEFORE)
                ? node.nextElementSibling
                : node.previousElementSibling;
            if (!(isNodeOfType(sibling, 'ELEMENT_NODE') && isEntityElement(sibling))) {
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

    const isAfter = node.classList.contains(DELIMITER_AFTER);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (checkEntity && entitySibling && isEntityElement(entitySibling)) {
        return;
    }

    node.classList.remove(DELIMITER_AFTER, DELIMITER_BEFORE);

    node.normalize();
    node.childNodes.forEach(cn => {
        const index = cn.textContent?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
        if (index >= 0) {
            const range = new Range();
            range.setStart(cn, index);
            range.setEnd(cn, index + 1);
            range.deleteContents();
        }
    });
}

function getFocusedElement(selection: RangeSelection): HTMLElement | null {
    const { range, isReverted } = selection;
    let node: Node | null = isReverted ? range.startContainer : range.endContainer;
    const offset = isReverted ? range.startOffset : range.endOffset;
    if (!isNodeOfType(node, 'ELEMENT_NODE')) {
        if (node.textContent != ZERO_WIDTH_SPACE && (node.textContent || '').length == offset) {
            node = node.nextSibling ?? node.parentElement?.nextElementSibling ?? null;
        } else {
            node = node?.parentElement ?? null;
        }
    } else {
        node = node.childNodes.length == offset ? node : node.childNodes.item(offset);
    }
    if (node && !node.hasChildNodes()) {
        node = node.nextSibling;
    }
    return isNodeOfType(node, 'ELEMENT_NODE') ? node : null;
}

/**
 * @internal
 */
export function handleDelimiterContentChangedEvent(editor: IStandaloneEditor) {
    const helper = editor.getDOMHelper();
    removeInvalidDelimiters(helper.queryElements(DELIMITER_SELECTOR));
    addDelimitersIfNeeded(helper.queryElements(INLINE_ENTITY_SELECTOR));
}

/**
 * @internal
 */
export function handleDelimiterKeyDownEvent(editor: IStandaloneEditor, event: KeyDownEvent) {
    const selection = editor.getDOMSelection();

    const { rawEvent } = event;
    if (!selection || selection.type != 'range') {
        return;
    }
    const isEnter = rawEvent.key === 'Enter';
    if (selection.range.collapsed && (isCharacterValue(rawEvent) || isEnter)) {
        const node = getFocusedElement(selection);
        if (node && isEntityDelimiter(node)) {
            const wrappedInEntity = node.closest('div.' + ENTITY_INFO_NAME);
            if (wrappedInEntity) {
                const isAfter = node.classList.contains(DELIMITER_AFTER);

                if (isAfter) {
                    selection.range.setStartAfter(wrappedInEntity);
                } else {
                    selection.range.setStartBefore(wrappedInEntity);
                }
                selection.range.collapse(true /* toStart */);

                if (isEnter) {
                    event.rawEvent.preventDefault();
                }

                editor.formatContentModel(handleKeyDownInBlockDelimiter, {
                    selectionOverride: {
                        type: 'range',
                        isReverted: false,
                        range: selection.range,
                    },
                });
            } else {
                if (isEnter) {
                    event.rawEvent.preventDefault();
                    editor.formatContentModel(handleEnterInlineEntity);
                } else {
                    editor
                        .getDocument()
                        .defaultView?.requestAnimationFrame(() =>
                            preventTypeInDelimiter(node, editor)
                        );
                }
            }
        }
    }
}

/**
 * @internal Exported Only for unit test
 * @returns
 */
export const handleKeyDownInBlockDelimiter: ContentModelFormatter = model => {
    iterateSelections(model, (_path, _tableContext, block) => {
        if (block?.blockType == 'Paragraph') {
            delete block.isImplicit;
            block.segments.unshift(createBr());
        }
    });
    return true;
};

/**
 * @internal Exported Only for unit test
 * @returns
 */
export const handleEnterInlineEntity: ContentModelFormatter = model => {
    let selectionBlock: ContentModelParagraph | undefined;
    let selectionBlockParent: ContentModelBlockGroup | undefined;

    iterateSelections(model, (path, _tableContext, block) => {
        if (block?.blockType == 'Paragraph') {
            selectionBlock = block;
            selectionBlockParent = path[path.length - 1];
        }
    });

    if (selectionBlock && selectionBlockParent) {
        const selectionMarker = selectionBlock.segments.find(
            segment => segment.segmentType == 'SelectionMarker'
        );
        if (selectionMarker) {
            const markerIndex = selectionBlock.segments.indexOf(selectionMarker);
            const segmentsAfterMarker = selectionBlock.segments.splice(markerIndex);

            const newPara = createParagraph(
                false,
                selectionBlock.format,
                selectionBlock.segmentFormat,
                selectionBlock.decorator
            );
            newPara.segments.push(...segmentsAfterMarker);

            const selectionBlockIndex = selectionBlockParent.blocks.indexOf(selectionBlock);
            if (selectionBlockIndex >= 0) {
                selectionBlockParent.blocks.splice(selectionBlockIndex + 1, 0, newPara);
            }
        }
    }

    return true;
};
