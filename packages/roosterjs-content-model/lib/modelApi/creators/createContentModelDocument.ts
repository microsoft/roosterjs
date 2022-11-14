import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';

/**
 * @internal
 */
export function createContentModelDocument(doc: Document): ContentModelDocument {
    return {
        blockGroupType: 'Document',
        blocks: [],
        document: doc,
    };
}
