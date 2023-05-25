import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from './context/createDomToModelContext';
import { DomToModelOption } from '../publicTypes/IContentModelEditor';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import { parseFormat } from './utils/parseFormat';
import { rootDirectionFormatHandler } from '../formatHandlers/root/rootDirectionFormatHandler';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { zoomScaleFormatHandler } from '../formatHandlers/root/zoomScaleFormatHandler';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param editorContext Context of content model editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @returns A ContentModelDocument object that contains all the models created from the give root element
 */
export default function domToContentModel(
    root: HTMLElement | DocumentFragment,
    editorContext: EditorContext,
    option: DomToModelOption
): ContentModelDocument {
    const model = createContentModelDocument(editorContext.defaultFormat);
    const context = createDomToModelContext(editorContext, option);

    if (safeInstanceOf(root, 'DocumentFragment')) {
        context.elementProcessors.child(model, root, context);
    } else {
        // Need to calculate direction (ltr or rtl), use it as initial value
        parseFormat(root, [rootDirectionFormatHandler.parse], context.blockFormat, context);

        // Need to calculate zoom scale value from root element, use this value to calculate sizes for elements
        parseFormat(root, [zoomScaleFormatHandler.parse], context.zoomScaleFormat, context);

        const processor = option.includeRoot
            ? context.elementProcessors.element
            : context.elementProcessors.child;

        processor(model, root, context);
    }

    normalizeContentModel(model);

    return model;
}
