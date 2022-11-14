import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../domToModel/context/createDomToModelContext';
import { DomToModelOption } from '../publicTypes/IExperimentalContentModelEditor';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { normalizeModel } from '../modelApi/common/normalizeContentModel';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param editorContext Context of content model editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @returns A ContentModelDocument object that contains all the models created from the give root element
 */
export default function domToContentModel(
    root: HTMLElement,
    editorContext: EditorContext,
    option: DomToModelOption
): ContentModelDocument {
    const model = createContentModelDocument(root.ownerDocument!);
    const domToModelContext = createDomToModelContext(editorContext, option);
    const { element, child } = domToModelContext.elementProcessors;
    const processor = option.includeRoot ? element : child;

    processor(model, root, domToModelContext);

    normalizeModel(model);

    return model;
}
