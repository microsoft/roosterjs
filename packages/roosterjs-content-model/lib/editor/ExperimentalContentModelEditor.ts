import { containerProcessor } from '../domToModel/processors/containerProcessor';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from '../domToModel/creators/createContentModelDocument';
import { createFormatContext } from '../formatHandlers/createFormatContext';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { FormatContext } from '../formatHandlers/FormatContext';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { handleBlock } from '../modelToDom/handlers/handleBlock';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';
import { normalizeModel } from '../modelApi/normalizeContentModel';
import { optimize } from '../modelToDom/optimizers/optimize';
import { singleElementProcessor } from '../domToModel/processors/singleElementProcessor';

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * Experimental editor to support Content Model
 */
export default class ExperimentalContentModelEditor extends Editor
    implements IExperimentalContentModelEditor {
    private getDarkColor: ((lightColor: string) => string) | undefined;

    constructor(private contentDiv: HTMLDivElement, options?: EditorOptions) {
        super(contentDiv, options);
        this.getDarkColor = options?.getDarkColor;
    }

    createFormatContext(): FormatContext {
        return createFormatContext(
            this.isDarkMode(),
            this.getZoomScale(),
            getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            this.getDarkColor,
            this.getSelectionRangeEx()
        );
    }

    getContentModel(startNode?: HTMLElement): ContentModelDocument {
        const model = createContentModelDocument(this.getDocument());
        const context = this.createFormatContext();

        if (startNode) {
            singleElementProcessor(model, startNode, context);
        } else {
            containerProcessor(model, this.contentDiv, context);
        }

        normalizeModel(model);

        return model;
    }

    getDOMFromContentModel(model: ContentModelDocument): DocumentFragment {
        const fragment = model.document.createDocumentFragment();
        const context = this.createFormatContext();

        handleBlock(model.document, fragment, model, context);

        optimize(fragment, 2 /*optimizeLevel*/);

        return fragment;
    }
}
