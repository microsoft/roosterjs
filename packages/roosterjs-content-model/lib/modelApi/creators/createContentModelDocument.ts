import { ContentModelDocument } from '../../publicTypes/block/group/ContentModelDocument';

/**
 * @internal
 */
export function createContentModelDocument(doc: Document): ContentModelDocument {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'Document',
        blocks: [],
        document: doc,
    };
}
