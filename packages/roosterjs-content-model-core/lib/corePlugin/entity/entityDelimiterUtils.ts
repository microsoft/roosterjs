import { adjustSelectionAroundEntity } from './adjustSelectionAroundEntity';
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
    findClosestBlockEntityContainer,
    mutateSegment,
    setParagraphNotImplicit,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    CompositionEndEvent,
    ContentModelFormatter,
    ContentModelSegmentFormat,
    IEditor,
    KeyDownEvent,
    RangeSelection,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const DelimiterBefore = 'entityDelimiterBefore';
const DelimiterAfter = 'entityDelimiterAfter';
const DelimiterSelector = '.' + DelimiterAfter + ',.' + DelimiterBefore;
const ZeroWidthSpace = '\u200B';
const EntityInfoName = '_Entity';
const InlineEntitySelector = 'span.' + EntityInfoName;

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
                        if (
                            segment.segmentType == 'Text' &&
                            segment.text.indexOf(ZeroWidthSpace) >= 0
                        ) {
                            mutateSegment(block, segment, segment => {
                                segment.text = segment.text.replace(ZeroWidthSpace, '');
                            });
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

    const rawEvent = event.rawEvent;
    const range = selection.range;
    const key = rawEvent.key;

    switch (key) {
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
            if (!rawEvent.altKey && !rawEvent.ctrlKey && !rawEvent.metaKey) {
                // Handle in async so focus is already moved, this makes us easier to check if we should adjust the selection
                editor.getDocument().defaultView?.requestAnimationFrame(() => {
                    adjustSelectionAroundEntity(editor, key, rawEvent.shiftKey);
                });
            }
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
        const blockEntityContainer = findClosestBlockEntityContainer(focusedNode, helper);
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

/**
 * @internal Exported Only for unit test
 * @returns
 */
export const handleKeyDownInBlockDelimiter: ContentModelFormatter = (model, context) => {
    iterateSelections(model, (_path, _tableContext, block) => {
        if (block?.blockType == 'Paragraph') {
            const paragraph = mutateBlock(block);
            const selectionMarker = paragraph.segments.find(
                w => w.segmentType == 'SelectionMarker'
            );

            if (paragraph.isImplicit) {
                setParagraphNotImplicit(paragraph);
            }

            if (selectionMarker?.segmentType == 'SelectionMarker') {
                paragraph.segmentFormat = { ...selectionMarker.format };
                context.newPendingFormat = { ...selectionMarker.format };
            }

            paragraph.segments.unshift(createBr());
        }
    });

    return true;
};

/**
 * @internal Exported Only for unit test
 * @returns
 */
export const handleEnterInlineEntity: ContentModelFormatter = model => {
    let selectionBlock: ReadonlyContentModelParagraph | undefined;
    let selectionBlockParent: ReadonlyContentModelBlockGroup | undefined;

    iterateSelections(model, (path, _tableContext, block) => {
        if (block?.blockType == 'Paragraph') {
            selectionBlock = block;
            selectionBlockParent = path[path.length - 1];
        }
    });

    if (selectionBlock && selectionBlockParent) {
        const markerIndex = selectionBlock.segments.findIndex(
            segment => segment.segmentType == 'SelectionMarker'
        );

        if (markerIndex >= 0) {
            const paragraph = mutateBlock(selectionBlock);
            const segmentsAfterMarker = paragraph.segments.splice(markerIndex);

            const newPara: ShallowMutableContentModelParagraph = createParagraph(
                false,
                paragraph.format,
                paragraph.segmentFormat,
                paragraph.decorator
            );

            if (
                paragraph.segments.every(
                    x => x.segmentType == 'SelectionMarker' || x.segmentType == 'Br'
                ) ||
                segmentsAfterMarker.every(x => x.segmentType == 'SelectionMarker')
            ) {
                newPara.segments.push(createBr(paragraph.format));
            }

            newPara.segments.push(...segmentsAfterMarker);

            const selectionBlockIndex = selectionBlockParent.blocks.indexOf(paragraph);

            if (selectionBlockIndex >= 0) {
                mutateBlock(selectionBlockParent).blocks.splice(
                    selectionBlockIndex + 1,
                    0,
                    newPara
                );
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
