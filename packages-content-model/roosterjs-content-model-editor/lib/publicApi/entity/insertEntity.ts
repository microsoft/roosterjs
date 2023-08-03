import { ChangeSource, Entity, SelectionRangeEx } from 'roosterjs-editor-types';
import { commitEntity, getEntityFromElement } from 'roosterjs-editor-dom';
import { createBr, createParagraph, createSelectionMarker } from 'roosterjs-content-model-dom';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-editor/lib/modelApi/common/getClosestAncestorBlockGroupIndex';
import { getOnDeleteEntityCallback } from '../../editor/utils/handleKeyboardEventCommon';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { InsertPoint } from 'roosterjs-content-model/lib';
import { setSelection } from 'roosterjs-content-model-editor/lib/modelApi/selection/setSelection';
import {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelEntity,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

const BlockEntityTag = 'div';
const InlineEntityTag = 'span';

export interface InsertEntityOptions {
    contentNode?: Node;
    focusAfterEntity?: boolean;
    wrapperDisplay?: 'inline' | 'block' | 'none' | 'inline-block';
}

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end' | SelectionRangeEx,
    options?: InsertEntityOptions
): Entity;

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: true,
    position: 'focus' | 'begin' | 'end' | 'regionRootForBlock' | SelectionRangeEx,
    options?: InsertEntityOptions
): Entity;

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end' | 'regionRootForBlock' | SelectionRangeEx,
    options?: InsertEntityOptions
): Entity {
    const { contentNode, focusAfterEntity, wrapperDisplay } = options || {};
    const wrapper = editor.getDocument().createElement(isBlock ? BlockEntityTag : InlineEntityTag);
    const display = wrapperDisplay ?? (isBlock ? undefined : 'inline-block');

    wrapper.style.setProperty('display', display || null);

    if (contentNode) {
        wrapper.appendChild(contentNode);
    }

    commitEntity(wrapper, type, true /*isReadonly*/);

    const entityModel: ContentModelEntity = {
        blockType: 'Entity',
        segmentType: 'Entity',
        format: {},
        isReadonly: true,
        type,
        wrapper,
    };

    let selectionOverride: SelectionRangeEx | undefined;

    if (typeof position === 'object') {
        selectionOverride = position;
        position = 'focus';
    }

    formatWithContentModel(
        editor,
        'insertEntity',
        model => {
            let blockParent: ContentModelBlockGroup | undefined;
            let blockIndex = -1;
            let ip: InsertPoint | null;

            if (position == 'begin' || position == 'end') {
                blockParent = model;
                blockIndex = position == 'begin' ? 0 : model.blocks.length;
            } else if (
                (ip = deleteSelection(model, getOnDeleteEntityCallback(editor)).insertPoint)
            ) {
                const { marker, paragraph, path } = ip;

                if (!isBlock) {
                    const index = paragraph.segments.indexOf(marker);

                    if (index >= 0) {
                        paragraph.segments.splice(
                            focusAfterEntity ? index : index + 1,
                            0,
                            entityModel
                        );
                    }
                } else {
                    const pathIndex =
                        position == 'regionRootForBlock'
                            ? getClosestAncestorBlockGroupIndex(path, ['TableCell', 'Document'])
                            : 0;
                    blockParent = path[pathIndex];
                    const child = path[pathIndex - 1];
                    const directChild: ContentModelBlock =
                        child?.blockGroupType == 'FormatContainer' ||
                        child?.blockGroupType == 'General' ||
                        child?.blockGroupType == 'ListItem'
                            ? child
                            : paragraph;
                    const childIndex = blockParent.blocks.indexOf(directChild);
                    blockIndex = childIndex >= 0 ? childIndex + 1 : -1;
                }
            }

            if (blockIndex >= 0 && blockParent) {
                const nextBlock = blockParent.blocks[blockIndex];
                const blocksToInsert = [
                    isBlock ? entityModel : wrapWithParagraph(entityModel, model.format),
                ];
                let nextParagraph: ContentModelParagraph;

                if (nextBlock?.blockType == 'Paragraph') {
                    nextParagraph = nextBlock;
                } else {
                    nextParagraph = createParagraph(false /*isImplicit*/, {}, model.format);
                    nextParagraph.segments.push(createBr(model.format));
                    blocksToInsert.push(nextParagraph);
                }

                blockParent.blocks.splice(blockIndex, 0, ...blocksToInsert);

                if (focusAfterEntity) {
                    const marker = createSelectionMarker(
                        nextParagraph.segments[0]?.format || model.format
                    );

                    nextParagraph.segments.unshift(marker);
                    setSelection(model, marker, marker);
                }
            }

            return true;
        },
        {
            selectionOverride: selectionOverride,
            skipUndoSnapshot: true,
        }
    );

    const newEntity = getEntityFromElement(wrapper);

    if (!newEntity) {
        // Should never happen
        throw new Error('No entity created');
    }

    editor.triggerContentChangedEvent(ChangeSource.InsertEntity, newEntity);

    return newEntity;
}

function wrapWithParagraph(
    segment: ContentModelSegment,
    defaultFormat?: ContentModelSegmentFormat
): ContentModelParagraph {
    const para = createParagraph(false /*isImplicit*/, undefined /*format*/, defaultFormat);

    para.segments.push(segment);

    return para;
}
