import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';

/**
 * @internal
 */
export function createContentModelDocument(): ContentModelDocument {
    return {
        blockGroupType: 'Document',
        blocks: [],
    };
}
