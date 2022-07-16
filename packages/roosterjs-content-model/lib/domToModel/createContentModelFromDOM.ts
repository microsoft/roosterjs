import { containerProcessor } from './processors/containerProcessor';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from './creators/createContentModelDocument';

/**
 * Create Content Model from DOM node
 * @param root Root node of the DOM tree. This node itself will not be included in the Content Model
 * @param range Selection range
 * @returns A Content Model of the given root and selection
 */
export default function createContentModelFromDOM(
    root: ParentNode,
    range: Range | null
): ContentModelDocument {
    const model = createContentModelDocument(root.ownerDocument!);

    containerProcessor(model, root);

    return model;
}
