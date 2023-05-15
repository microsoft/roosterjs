import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { wrap } from 'roosterjs-editor-dom';

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    contentNode: Node,
    isBlock: true,
    isReadonly: boolean,
    position: 'focus' | 'begin' | 'end' | 'regionRoot',
    focusAfterEntity?: boolean
): void;

/**
 * Insert an inline entity into editor
 * @param editor
 * @param type
 * @param contentNode
 * @param isBlock
 * @param isReadonly
 * @param position
 * @param focusAfterEntity
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    contentNode: Node,
    isBlock: false,
    isReadonly: boolean,
    position: 'focus' | 'begin' | 'end',
    focusAfterEntity?: boolean
): void;

export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    contentNode: Node,
    isBlock: boolean,
    isReadonly: boolean,
    position: 'focus' | 'begin' | 'end' | 'regionRoot',
    focusAfterEntity?: boolean
): void {
    // commitEntity(wrapper, type, isReadonly);

    const entity: ContentModelEntity = {
        blockType: 'Entity',
        segmentType: 'Entity',
        format: {}, // TODO
        isReadonly: isReadonly,
        type: type,
        wrapper: wrap(contentNode, isBlock ? 'div' : 'span'),
    };

    if (!isBlock && isReadonly) {
        entity.wrapper.style.display = 'inline-block';
    }

    const doc: ContentModelDocument = {
        blockGroupType: 'Document',
        format: {},
        blocks: [
            isBlock
                ? entity
                : {
                      blockType: 'Paragraph',
                      format: {},
                      segments: [entity],
                  },
        ],
    };

    formatWithContentModel(editor, 'insertEntity', model => {
        mergeModel(model, doc);
        return true;
    });
}
