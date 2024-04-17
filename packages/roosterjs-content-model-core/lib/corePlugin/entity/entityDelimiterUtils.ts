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
    getSelectedSegmentsAndParagraphs,
    createSelectionMarker,
    setSelection,
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

    if (!selection || selection.type != 'range') {
        return;
    }

    const { rawEvent } = event;
    const { range, isReverted } = selection;

    switch (rawEvent.key) {
        case 'Enter':
            if (range.collapsed) {
                handleInputOnDelimiter(editor, range, getFocusedElement(selection), rawEvent);
            } else {
                const helper = editor.getDOMHelper();
                const entity = findClosestEntityWrapper(range.startContainer, helper);

                if (
                    entity &&
                    isNodeOfType(entity, 'ELEMENT_NODE') &&
                    helper.isNodeInEditor(entity)
                ) {
                    triggerEntityEventOnEnter(editor, entity, rawEvent);
                }
            }
            break;

        case 'ArrowLeft':
        case 'ArrowRight':
            handleMovingOnDelimiter(editor, isReverted, rawEvent);
            break;

        default:
            if (isCharacterValue(rawEvent) && range.collapsed) {
                handleInputOnDelimiter(editor, range, getFocusedElement(selection), rawEvent);
            }

            break;
    }
}

function handleInputOnDelimiter(
    editor: IEditor,
    range: Range,
    focusedNode: HTMLElement | null,
    rawEvent: KeyboardEvent
) {
    const helper = editor.getDOMHelper();

    if (focusedNode && isEntityDelimiter(focusedNode) && helper.isNodeInEditor(focusedNode)) {
        const blockEntityContainer = focusedNode.closest(BlockEntityContainerSelector);
        const isEnter = rawEvent.key === 'Enter';

        if (blockEntityContainer && helper.isNodeInEditor(blockEntityContainer)) {
            const isAfter = focusedNode.classList.contains(DelimiterAfter);

            if (isAfter) {
                range.setStartAfter(blockEntityContainer);
            } else {
                range.setStartBefore(blockEntityContainer);
            }

            range.collapse(true /* toStart */);

            if (isEnter) {
                rawEvent.preventDefault();
            }

            editor.formatContentModel(handleKeyDownInBlockDelimiter, {
                selectionOverride: {
                    type: 'range',
                    isReverted: false,
                    range,
                },
            });
        } else {
            if (isEnter) {
                rawEvent.preventDefault();
                editor.formatContentModel(handleEnterInlineEntity);
            } else {
                editor.takeSnapshot();
                editor
                    .getDocument()
                    .defaultView?.requestAnimationFrame(() =>
                        preventTypeInDelimiter(focusedNode, editor)
                    );
            }
        }
    }
}

function handleMovingOnDelimiter(editor: IEditor, isReverted: boolean, rawEvent: KeyboardEvent) {
    editor.formatContentModel(model => {
        const selections = getSelectedSegmentsAndParagraphs(
            model,
            false /*includingFormatHolder*/,
            true /*includingEntity*/
        );
        const selection = isReverted ? selections[0] : selections[selections.length - 1];

        if (selection?.[1]) {
            const [segment, paragraph] = selection;
            const movingBefore =
                (rawEvent.key == 'ArrowLeft') != (paragraph.format.direction == 'rtl');
            const isShrinking =
                rawEvent.shiftKey &&
                segment.segmentType != 'SelectionMarker' &&
                movingBefore != isReverted;
            const index = paragraph.segments.indexOf(segment);
            const targetIndex = isShrinking
                ? index
                : index >= 0
                ? movingBefore
                    ? index - 1
                    : index + 1
                : -1;
            const targetSegment = targetIndex >= 0 ? paragraph.segments[targetIndex] : null;

            if (targetSegment?.segmentType == 'Entity') {
                if (rawEvent.shiftKey) {
                    targetSegment.isSelected = !isShrinking;

                    if (!isShrinking && movingBefore) {
                        model.hasRevertedRangeSelection = true;
                    }
                }

                if (!rawEvent.shiftKey || (isShrinking && selections.length == 1)) {
                    const formatSegment =
                        paragraph.segments[movingBefore ? targetIndex - 1 : targetIndex + 1];
                    const marker = createSelectionMarker(
                        formatSegment?.format ?? targetSegment.format
                    );

                    paragraph.segments.splice(
                        movingBefore ? targetIndex : targetIndex + 1,
                        0,
                        marker
                    );

                    setSelection(model, marker);
                }

                rawEvent.preventDefault();

                return true;
            } else {
                return false;
            }
        }

        return false;
    });
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
