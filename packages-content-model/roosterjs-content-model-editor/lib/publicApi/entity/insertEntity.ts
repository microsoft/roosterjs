import { commitEntity, createElement, getEntityFromElement } from 'roosterjs-editor-dom';
import { ContentModelEntity } from 'roosterjs-content-model-types';
import { createParagraph } from 'roosterjs-content-model-dom/lib';
import { deleteSelection } from 'roosterjs-content-model-editor/lib/modelApi/edit/deleteSelection';
import { Entity } from 'roosterjs-editor-types';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getOnDeleteEntityCallback } from 'roosterjs-content-model-editor/lib/editor/utils/handleKeyboardEventCommon';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

export interface InsertEntityOptions {
    contentNode?: Node;
    focusAfterEntity?: boolean;
    skipInsertingNewLineAfterBlockEntity?: boolean;
    wrapperDisplay?: '' | 'inline' | 'block' | 'none' | 'inline-block';
}

const BlockEntityTag = 'div';
const InlineEntityTag = 'span';

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end',
    options?: InsertEntityOptions
): Entity;

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: true,
    position: 'focus' | 'begin' | 'end' | 'regionRootForBlock',
    options?: InsertEntityOptions
): Entity;

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end' | 'regionRootForBlock',
    options?: InsertEntityOptions
): Entity {
    const { contentNode, focusAfterEntity, skipInsertingNewLineAfterBlockEntity, wrapperDisplay } =
        options || {};
    const wrapper = createElement(
        {
            tag: isBlock ? BlockEntityTag : InlineEntityTag,
            style:
                typeof wrapperDisplay == 'string'
                    ? 'display:' + wrapperDisplay
                    : isBlock
                    ? undefined
                    : 'display: inline-block',
        },
        editor.getDocument()
    ) as HTMLElement;

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

    formatWithContentModel(editor, 'insertEntity', model => {
        const insertPoint = deleteSelection(model, getOnDeleteEntityCallback(editor)).insertPoint;

        if (insertPoint) {
            const { marker, paragraph, path } = insertPoint;

            if (isBlock) {
                const index = path[0].blocks.indexOf(paragraph);

                if (index >= 0) {
                    const newBlocks =
                        index == path[0].blocks.length - 1 || !skipInsertingNewLineAfterBlockEntity
                            ? [
                                  entityModel,
                                  createParagraph(false /*isImplicit*/, undefined, model.format),
                              ]
                            : [entityModel];

                    path[0].blocks.splice(index + 1, 0, ...newBlocks);
                }
            } else {
                const index = paragraph.segments.indexOf(marker);

                if (index >= 0) {
                    paragraph.segments.splice(focusAfterEntity ? index : index + 1, 0, entityModel);
                }
            }
        }

        return true;
    });

    const newEntity = getEntityFromElement(wrapper);

    if (!newEntity) {
        // Should never happen
        throw new Error('No entity created');
    }

    return newEntity;
}
