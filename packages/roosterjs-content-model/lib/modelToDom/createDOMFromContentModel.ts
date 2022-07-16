import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Create DOM tree from Content Model
 * @param model The root of Content Model
 * @param optimizeLevel Optimization level, @default 2
 * @returns A DocumentFragment of DOM tree from the Content Model and the selection from this model
 */
export default function createDOMFromContentModel(
    model: ContentModelDocument,
    optimizeLevel: number = 2
): [DocumentFragment, SelectionRangeEx | undefined] {
    const fragment = model.document.createDocumentFragment();

    // TODO: Create the fragment from Content Model

    return [fragment, undefined];
}
