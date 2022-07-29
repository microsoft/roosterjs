import createContentModelFromDOM from '../domToModel/createContentModelFromDOM';
import createDOMFromContentModel from '../modelToDom/createDOMFromContentModel';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';

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

    getContentModel(startNode?: HTMLElement): ContentModelDocument {
        return createContentModelFromDOM(
            this.contentDiv,
            this.getSelectionRangeEx(),
            this.isDarkMode(),
            this.getZoomScale(),
            getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            this.getDarkColor,
            startNode
        );
    }

    getDOMFromContentModel(model: ContentModelDocument): DocumentFragment {
        return createDOMFromContentModel(
            model,
            this.isDarkMode(),
            this.getZoomScale(),
            getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            this.getDarkColor
        )[0];
    }
}
