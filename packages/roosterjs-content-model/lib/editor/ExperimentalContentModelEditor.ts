import { containerProcessor } from '../domToModel/processors/containerProcessor';
import { ContentModelContext } from '../publicTypes/ContentModelContext';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from '../modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../modelToDom/context/createModelToDomContext';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { handleBlock } from '../modelToDom/handlers/handleBlock';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';
import { normalizeModel } from '../modelApi/common/normalizeContentModel';
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

    /**
     * Creates an instance of ExperimentalContentModelEditor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(private contentDiv: HTMLDivElement, options?: EditorOptions) {
        super(contentDiv, options);
        this.getDarkColor = options?.getDarkColor;
    }

    /**
     * Create a ContentModelContext object used by ContentModel API
     */
    createContentModelContext(): ContentModelContext {
        return {
            isDarkMode: this.isDarkMode(),
            zoomScale: this.getZoomScale(),
            isRightToLeft: getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            getDarkColor: this.getDarkColor,
        };
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param startNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     */
    createContentModel(startNode?: HTMLElement): ContentModelDocument {
        const model = createContentModelDocument(this.getDocument());
        const contentModelContext = this.createContentModelContext();

        const domToModelContext = createDomToModelContext(
            contentModelContext,
            this.getSelectionRangeEx()
        );

        if (startNode) {
            singleElementProcessor(model, startNode, domToModelContext);
        } else {
            containerProcessor(model, this.contentDiv, domToModelContext);
        }

        normalizeModel(model);

        return model;
    }

    /**
     * Create DOM fragment from Content Model
     * @param model The Content Model to create fragment from
     */
    createFragmentFromContentModel(model: ContentModelDocument): DocumentFragment {
        const fragment = model.document.createDocumentFragment();
        const contentModelContext = this.createContentModelContext();
        const modelToDomContext = createModelToDomContext(contentModelContext);

        handleBlock(model.document, fragment, model, modelToDomContext);

        optimize(fragment, 2 /*optimizeLevel*/);

        return fragment;
    }
}
