import { ContentModelBlockGroupType } from '../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../publicTypes/enum/BlockType';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';

/**
 * Create Content Model from DOM node
 * @param root Root node of the DOM tree. This node itself will not be included in the Content Model
 * @param range Selection range
 * @returns A Content Model of the given root and selection
 */
export default function createContentModelFromDOM(
    root: Node,
    range: Range | null
): ContentModelDocument {
    const model = createEmptyModel(root.ownerDocument!);

    // TODO: Fill the model

    return model;
}

function createEmptyModel(doc: Document): ContentModelDocument {
    return {
        blockGroupType: ContentModelBlockGroupType.Document,
        blockType: ContentModelBlockType.BlockGroup,
        blocks: [],
        document: doc,
    };
}
