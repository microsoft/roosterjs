import { ChangeSource, Entity, NodePosition, SelectionRangeEx } from 'roosterjs-editor-types';
import { commitEntity, getEntityFromElement } from 'roosterjs-editor-dom';
import { createBr, createParagraph } from 'roosterjs-content-model-dom';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getOnDeleteEntityCallback } from '../../editor/utils/handleKeyboardEventCommon';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
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
    position: 'focus' | 'begin' | 'end' | NodePosition,
    options?: InsertEntityOptions
): Entity;

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: true,
    position: 'focus' | 'begin' | 'end' | 'regionRootForBlock' | NodePosition,
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

    if (display) {
        wrapper.style.display = display;
    }

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
            const insertPoint = deleteSelection(model, getOnDeleteEntityCallback(editor))
                .insertPoint;

            switch (position) {
                case 'begin':
                case 'end':
                    insertBlock(
                        model,
                        isBlock ? entityModel : wrapWithParagraph(entityModel, model.format),
                        position == 'begin' ? 0 : model.blocks.length
                    );
                    break;

                case 'regionRootForBlock':
                    break;

                case 'focus':
                    if (insertPoint) {
                        const { marker, paragraph, path } = insertPoint;

                        if (isBlock) {
                            const index = path[0].blocks.indexOf(paragraph);

                            if (index >= 0) {
                                const newBlocks =
                                    index == path[0].blocks.length - 1
                                        ? [
                                              entityModel,
                                              createParagraph(
                                                  false /*isImplicit*/,
                                                  undefined,
                                                  model.format
                                              ),
                                          ]
                                        : [entityModel];

                                path[0].blocks.splice(index + 1, 0, ...newBlocks);
                            }
                        } else {
                            const index = paragraph.segments.indexOf(marker);

                            if (index >= 0) {
                                paragraph.segments.splice(
                                    focusAfterEntity ? index : index + 1,
                                    0,
                                    entityModel
                                );
                            }
                        }
                    }
                    break;
            }

            return true;
        },
        {
            selectionOverride: selectionOverride,
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

function insertBlock(
    parent: ContentModelBlockGroup,
    block: ContentModelBlock,
    index: number
): ContentModelParagraph | null {
    const newPara = index == parent.blocks.length ? wrapWithParagraph(createBr()) : null;

    parent.blocks.splice(index, 0, block);

    if (newPara) {
        parent.blocks.splice(index + 1, 0, newPara);
    }

    return newPara;
}
