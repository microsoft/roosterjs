import { containerProcessor } from '../domToModel/processors/containerProcessor';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../domToModel/context/createDomToModelContext';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { normalizeModel } from '../modelApi/common/normalizeContentModel';
import { SelectionRangeEx } from 'roosterjs-editor-types';
import { singleElementProcessor } from '../domToModel/processors/singleElementProcessor';

/**
 * Create Content Model from DOM tree in this editor
 * @param root Root element of DOM tree to create Content Model from
 * @param editorContext Context of content model editor
 * @param includeRoot True to create content model from the root element itself, false to create from all child nodes of root. @default false
 * @param range Selection range of the DOM tree. If not passed, the content model will not include selection
 * @returns A ContentModelDocument object that contains all the models created from the give root element
 */
export default function domToContentModel(
    root: HTMLElement,
    editorContext: EditorContext,
    includeRoot?: boolean,
    range?: SelectionRangeEx
): ContentModelDocument {
    const model = createContentModelDocument(root.ownerDocument!);
    const domToModelContext = createDomToModelContext(editorContext, range);

    if (includeRoot) {
        singleElementProcessor(model, root, domToModelContext);
    } else {
        containerProcessor(model, root, domToModelContext);
    }

    normalizeModel(model);

    return model;
}
