import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelDocument } from '../../publicTypes/block/group/ContentModelDocument';

/**
 * @internal
 */
export function createContentModelDocument(doc: Document): ContentModelDocument {
    return {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.Document,
        blocks: [],
        document: doc,
    };
}
