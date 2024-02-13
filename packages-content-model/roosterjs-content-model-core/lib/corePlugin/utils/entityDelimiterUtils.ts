import { isCharacterValue } from '../../publicApi/domUtils/eventUtils';
import { iterateSelections } from '../../publicApi/selection/iterateSelections';
import type {
    CompositionEndEvent,
    ContentModelBlockGroup,
    ContentModelFormatter,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    IStandaloneEditor,
    KeyDownEvent,
} from 'roosterjs-content-model-types';
import {
    addDelimiters,
    createBr,
    createModelToDomContext,
    createParagraph,
    isEntityDelimiter,
    isEntityElement,
    isNodeOfType,
} from 'roosterjs-content-model-dom';

const DelimiterBefore = 'entityDelimiterBefore';
const DelimiterAfter = 'entityDelimiterAfter';
const DelimiterSelector = '.' + DelimiterAfter + ',.' + DelimiterBefore;
const ZeroWidthSpace = '\u200B';
const EntityInfoName = '_Entity';
const InlineEntitySelector = 'span.' + EntityInfoName;
const BlockEntityContainer = '_E_EBlockEntityContainer';
const BlockEntityContainerSelector = '.' + BlockEntityContainer;

/**
 * @internal exported only for unit test
 */
export function preventTypeInDelimiter(node: HTMLElement, editor: IStandaloneEditor) {
    const isAfter = node.classList.contains(DelimiterAfter);
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
                            segment.text = segment.text.replace(ZeroWidthSpace, '');
                        }
                    });
                }
            });
            return true;
        });
    }
}

function addDelimitersIfNeeded(
    nodes: Element[] | NodeListOf<Element>,
    format: ContentModelSegmentFormat | null
) {
    if (nodes.length > 0) {
        const context = createModelToDomContext();
        nodes.forEach(node => {
            if (
                isNodeOfType(node, 'ELEMENT_NODE') &&
                isEntityElement(node) &&
                !node.isContentEditable
            ) {
                addDelimiters(node.ownerDocument, node as HTMLElement, format, context);
            }
        });
    }
}

function removeNode(el: Node | undefined | null) {
    el?.parentElement?.removeChild(el);
}

function removeInvalidDelimiters(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (!isNodeOfType(node, 'ELEMENT_NODE')) {
            return;
        }
        if (isEntityDelimiter(node)) {
            const sibling = node.classList.contains(DelimiterBefore)
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

    const isAfter = node.classList.contains(DelimiterAfter);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (checkEntity && entitySibling && isEntityElement(entitySibling)) {
        return;
    }

    node.classList.remove(DelimiterAfter, DelimiterBefore);

    node.normalize();
    node.childNodes.forEach(cn => {
        const index = cn.textContent?.indexOf(ZeroWidthSpace) ?? -1;
        if (index >= 0) {
            const range = new Range();
            range.setStart(cn, index);
            range.setEnd(cn, index + 1);
            range.deleteContents();
        }
    });
}

function getFocusedDelimiter(
    editor: IStandaloneEditor,
    stringAfterZWS?: string
): HTMLElement | null {
    const selection = editor.getDOMSelection();
    const helper = editor.getDOMHelper();
    let node: Node | null = null;

    if (selection?.type == 'range' && selection.range.collapsed) {
        const { range, isReverted } = selection;
        const offset = isReverted ? range.startOffset : range.endOffset;
        const expectedText = stringAfterZWS ? ZeroWidthSpace + stringAfterZWS : ZeroWidthSpace;

        node = isReverted ? range.startContainer : range.endContainer;

        if (!isNodeOfType(node, 'ELEMENT_NODE')) {
            if (node.textContent != expectedText && (node.textContent || '').length == offset) {
                node = node.nextSibling ?? node.parentElement?.closest(DelimiterSelector) ?? null;
            } else {
                node = node?.parentElement?.closest(DelimiterSelector) ?? null;
            }
        } else {
            node = node.childNodes.length == offset ? node : node.childNodes.item(offset);
        }

        if (node && !node.hasChildNodes()) {
            const next = node.nextSibling;

            node =
                isNodeOfType(next, 'ELEMENT_NODE') &&
                next.matches(DelimiterSelector) &&
                next.textContent == expectedText
                    ? next
                    : null;
        }
    }

    return isNodeOfType(node, 'ELEMENT_NODE') && helper.isNodeInEditor(node) ? node : null;
}

/**
 * @internal
 */
export function handleDelimiterContentChangedEvent(editor: IStandaloneEditor) {
    const helper = editor.getDOMHelper();
    removeInvalidDelimiters(helper.queryElements(DelimiterSelector));
    addDelimitersIfNeeded(helper.queryElements(InlineEntitySelector), editor.getPendingFormat());
}

/**
 * @internal
 */
export function handleCompositionEndEvent(editor: IStandaloneEditor, event: CompositionEndEvent) {
    const delimiter = getFocusedDelimiter(editor, event.rawEvent.data);

    if (delimiter?.firstChild && isNodeOfType(delimiter.firstChild, 'TEXT_NODE')) {
        preventTypeInDelimiter(delimiter, editor);
    }
}

/**
 * @internal
 */
export function handleDelimiterKeyDownEvent(editor: IStandaloneEditor, event: KeyDownEvent) {
    const { rawEvent } = event;
    const isEnter = rawEvent.key === 'Enter';
    let node: HTMLElement | null;

    if ((isCharacterValue(rawEvent) || isEnter) && (node = getFocusedDelimiter(editor))) {
        const helper = editor.getDOMHelper();
        const blockEntityContainer = node.closest(BlockEntityContainerSelector);

        if (blockEntityContainer && helper.isNodeInEditor(blockEntityContainer)) {
            const isAfter = node.classList.contains(DelimiterAfter);
            const range = editor.getDocument().createRange();

            if (isAfter) {
                range.setStartAfter(blockEntityContainer);
            } else {
                range.setStartBefore(blockEntityContainer);
            }

            range.collapse(true /* toStart */);

            if (isEnter) {
                event.rawEvent.preventDefault();
            }

            editor.formatContentModel(handleKeyDownInBlockDelimiter, {
                selectionOverride: {
                    type: 'range',
                    isReverted: false,
                    range: range,
                },
            });
        } else {
            if (isEnter) {
                event.rawEvent.preventDefault();
                editor.formatContentModel(handleEnterInlineEntity);
            } else {
                editor
                    .getDocument()
                    .defaultView?.requestAnimationFrame(
                        () => node && preventTypeInDelimiter(node, editor)
                    );
            }
        }
    }
}

/**
 * @internal Exported Only for unit test
 * @returns
 */
export const handleKeyDownInBlockDelimiter: ContentModelFormatter = (model, context) => {
    iterateSelections(model, (_path, _tableContext, block) => {
        if (block?.blockType == 'Paragraph') {
            delete block.isImplicit;
            const selectionMarker = block.segments.find(w => w.segmentType == 'SelectionMarker');
            if (selectionMarker?.segmentType == 'SelectionMarker') {
                block.segmentFormat = { ...selectionMarker.format };
                context.newPendingFormat = { ...selectionMarker.format };
            }
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
