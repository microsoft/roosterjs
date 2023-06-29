import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from './context/createDomToModelContext';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import {
    ContentModelDocument,
    DomToModelOption,
    DomToModelSelectionContext,
    EditorContext,
} from 'roosterjs-content-model-types';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param editorContext Context of content model editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @returns A ContentModelDocument object that contains all the models created from the give root element
 */
export function domToContentModel(
    root: HTMLElement | DocumentFragment,
    option?: DomToModelOption,
    editorContext?: EditorContext,
    selectionContext?: DomToModelSelectionContext
): ContentModelDocument {
    const model = createContentModelDocument(editorContext?.defaultFormat);
    const context = createDomToModelContext(editorContext, option, selectionContext);

    context.elementProcessors.child(model, root, context);

    normalizeContentModel(model);

    return model;
}
