import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import type { ContentModelDocument, DomToModelContext } from 'roosterjs-content-model-types';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param context Context object for DOM to Content Model conversion
 * @returns A ContentModelDocument object that contains all the models created from the give root element
 */
export function domToContentModel(
    root: HTMLElement | DocumentFragment,
    context: DomToModelContext
): ContentModelDocument {
    const model = createContentModelDocument(context.defaultFormat);

    context.elementProcessors.child(model, root, context);

    normalizeContentModel(model);

    return model;
}
