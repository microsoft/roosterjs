import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../domToModel/context/createDomToModelContext';
import { DomToModelOption } from '../publicTypes/IExperimentalContentModelEditor';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import { parseFormat } from '../domToModel/utils/parseFormat';
import { rootDirectionFormatHandler } from '../formatHandlers/root/rootDirectionFormatHandler';
import { zoomScaleFormatHandler } from '../formatHandlers/root/zoomScaleFormatHandler';

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
    const model = createContentModelDocument();
    const context = createDomToModelContext(editorContext, option);

    parseFormat(root, [rootDirectionFormatHandler.parse], context.blockFormat, context);
    parseFormat(root, [zoomScaleFormatHandler.parse], context.zoomScaleFormat, context);

    const processor = option.includeRoot
        ? context.elementProcessors.element
        : context.elementProcessors.child;

    processor(model, root, context);

    normalizeContentModel(model);

    return model;
}
