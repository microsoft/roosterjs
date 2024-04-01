import { normalizePos } from '../selection/normalizePos';
import {
    addDelimiters,
    createBr,
    createModelToDomContext,
    createParagraph,
    isEntityDelimiter,
    isEntityElement,
    isNodeOfType,
    parseEntityFormat,
    findClosestEntityWrapper,
    iterateSelections,
    isCharacterValue,
} from 'roosterjs-content-model-dom';
import type {
    CompositionEndEvent,
    ContentModelBlockGroup,
    ContentModelFormatter,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    IEditor,
    KeyDownEvent,
    RangeSelection,
} from 'roosterjs-content-model-types';

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
export function preventTypeInDelimiter(node: HTMLElement, editor: IEditor) {
    const isAfter = node.classList.contains(DelimiterAfter);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (entitySibling && isEntityElement(entitySibling)) {
        removeInvalidDelimiters(
            [entitySibling.previousElementSibling, entitySibling.nextElementSibling].filter(
                element => !!element
            ) as HTMLElement[]
        );
        editor.formatContentModel((model, context) => {
            iterateSelections(model, (_path, _tableContext, block, _segments) => {
                if (block?.blockType == 'Paragraph') {
                    block.segments.forEach(segment => {
                        if (segment.segmentType == 'Text') {
                            segment.text = segment.text.replace(ZeroWidthSpace, '');
                        }
                    });
                }
            });

            context.skipUndoSnapshot = true;

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

function getFocusedElement(
    selection: RangeSelection,
    existingTextInDelimiter?: string
): HTMLElement | null {
    const { range, isReverted } = selection;
    let node: Node | null = isReverted ? range.startContainer : range.endContainer;
    let offset = isReverted ? range.startOffset : range.endOffset;

    if (node) {
        const pos = normalizePos(node, offset);
        node = pos.node;
        offset = pos.offset;
    }

    if (!isNodeOfType(node, 'ELEMENT_NODE')) {
        const textToCheck = existingTextInDelimiter
            ? ZeroWidthSpace + existingTextInDelimiter
            : ZeroWidthSpace;

        if (node.textContent != textToCheck && (node.textContent || '').length == offset) {
            node = node.nextSibling ?? node.parentElement?.closest(DelimiterSelector) ?? null;
        } else {
            node = node?.parentElement?.closest(DelimiterSelector) ?? null;
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
export function handleDelimiterContentChangedEvent(editor: IEditor) {
    const helper = editor.getDOMHelper();
    removeInvalidDelimiters(helper.queryElements(DelimiterSelector));
    addDelimitersIfNeeded(helper.queryElements(InlineEntitySelector), editor.getPendingFormat());
}

/**
 * @internal
 */
export function handleCompositionEndEvent(editor: IEditor, event: CompositionEndEvent) {
    const selection = editor.getDOMSelection();

    if (selection?.type == 'range' && selection.range.collapsed) {
        const node = getFocusedElement(selection, event.rawEvent.data);

        if (
            node?.firstChild &&
            isNodeOfType(node.firstChild, 'TEXT_NODE') &&
            node.matches(DelimiterSelector) &&
            node.textContent == ZeroWidthSpace + event.rawEvent.data
        ) {
            preventTypeInDelimiter(node, editor);
        }
    }
}

/**
 * @internal
 */
export function handleDelimiterKeyDownEvent(editor: IEditor, event: KeyDownEvent) {
    const selection = editor.getDOMSelection();

    const { rawEvent } = event;
    if (!selection || selection.type != 'range') {
        return;
    }
    const isEnter = rawEvent.key === 'Enter';
    const helper = editor.getDOMHelper();
    if (selection.range.collapsed && (isCharacterValue(rawEvent) || isEnter)) {
        const helper = editor.getDOMHelper();
        const node = getFocusedElement(selection);
        if (node && isEntityDelimiter(node) && helper.isNodeInEditor(node)) {
            const blockEntityContainer = node.closest(BlockEntityContainerSelector);
            if (blockEntityContainer && helper.isNodeInEditor(blockEntityContainer)) {
                const isAfter = node.classList.contains(DelimiterAfter);

                if (isAfter) {
                    selection.range.setStartAfter(blockEntityContainer);
                } else {
                    selection.range.setStartBefore(blockEntityContainer);
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
                    editor.takeSnapshot();
                    editor
                        .getDocument()
                        .defaultView?.requestAnimationFrame(() =>
                            preventTypeInDelimiter(node, editor)
                        );
                }
            }
        }
    } else if (isEnter) {
        const entity = findClosestEntityWrapper(selection.range.startContainer, helper);
        if (entity && isNodeOfType(entity, 'ELEMENT_NODE') && helper.isNodeInEditor(entity)) {
            triggerEntityEventOnEnter(editor, entity, rawEvent);
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

            if (
                selectionBlock.segments.every(
                    x => x.segmentType == 'SelectionMarker' || x.segmentType == 'Br'
                ) ||
                segmentsAfterMarker.every(x => x.segmentType == 'SelectionMarker')
            ) {
                newPara.segments.push(createBr(selectionBlock.format));
            }

            newPara.segments.push(...segmentsAfterMarker);

            const selectionBlockIndex = selectionBlockParent.blocks.indexOf(selectionBlock);
            if (selectionBlockIndex >= 0) {
                selectionBlockParent.blocks.splice(selectionBlockIndex + 1, 0, newPara);
            }
        }
    }

    return true;
};

const triggerEntityEventOnEnter = (
    editor: IEditor,
    wrapper: HTMLElement,
    rawEvent: KeyboardEvent
) => {
    const format = parseEntityFormat(wrapper);
    if (format.id && format.entityType && !format.isFakeEntity) {
        editor.triggerEvent('entityOperation', {
            operation: 'click',
            entity: {
                id: format.id,
                type: format.entityType,
                isReadonly: !!format.isReadonly,
                wrapper,
            },
            rawEvent: rawEvent,
        });
    }
};
