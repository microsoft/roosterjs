import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import { ContentModelDocument, DomToModelContext } from 'roosterjs-content-model-types';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param config DOM Processor and format parser configuration
 * @param editorContext Context of editor
 * @param selection Selection that already exists in content
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
