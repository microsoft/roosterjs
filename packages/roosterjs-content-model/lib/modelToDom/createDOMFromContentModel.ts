import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createBlockFromContentModel } from './creators/createBlockFromContentModel';
import { optimize } from './optimize/optimize';
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

    createBlockFromContentModel(model.document, fragment, model);

    optimize(fragment, optimizeLevel);

    return [fragment, undefined];
}
