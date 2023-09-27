import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import type { ContentModelDocument, DomToModelContext } from 'roosterjs-content-model-types';
import type { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param context Context object for DOM to Content Model conversion
 * @param selection Selection that already exists in content
 * @returns A ContentModelDocument object that contains all the models created from the give root element
 */
export function domToContentModel(
    root: HTMLElement | DocumentFragment,
    context: DomToModelContext,
    selection?: SelectionRangeEx
): ContentModelDocument {
    const model = createContentModelDocument(context.defaultFormat);

    context.rangeEx = selection;
    context.elementProcessors.child(model, root, context);

    normalizeContentModel(model);

    return model;
}
