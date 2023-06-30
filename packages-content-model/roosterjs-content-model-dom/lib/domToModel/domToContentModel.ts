import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from './context/createDomToModelContext';
import { isNodeOfType } from '../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
import { parseFormat } from './utils/parseFormat';
import { rootDirectionFormatHandler } from '../formatHandlers/root/rootDirectionFormatHandler';
import { zoomScaleFormatHandler } from '../formatHandlers/root/zoomScaleFormatHandler';
import {
    ContentModelDocument,
    DomToModelOption,
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
    editorContext?: EditorContext,
    option?: DomToModelOption
): ContentModelDocument {
    const model = createContentModelDocument(editorContext?.defaultFormat);
    const context = createDomToModelContext(editorContext, option);

    if (isNodeOfType(root, NodeType.Element)) {
        // Need to calculate direction (ltr or rtl), use it as initial value
        parseFormat(root, [rootDirectionFormatHandler.parse], context.blockFormat, context);

        // Need to calculate zoom scale value from root element, use this value to calculate sizes for elements
        parseFormat(root, [zoomScaleFormatHandler.parse], context.zoomScaleFormat, context);
    }

    context.elementProcessors.child(model, root, context);

    normalizeContentModel(model);

    return model;
}
