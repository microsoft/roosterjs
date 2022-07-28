import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, SelectionRangeEx } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { getDarkColor } from 'roosterjs-color-utils';
import {
    ContentModelDocument,
    createContentModelFromDOM,
    createDOMFromContentModel,
} from 'roosterjs-content-model';

export default class HackedEditor extends Editor {
    constructor(private contentDiv: HTMLDivElement, options?: EditorOptions) {
        super(contentDiv, options);
    }

    getContentModel(startNode?: HTMLElement): ContentModelDocument {
        return createContentModelFromDOM(
            this.contentDiv,
            this.getSelectionRangeEx(),
            this.isDarkMode(),
            this.getZoomScale(),
            getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            getDarkColor,
            startNode
        );
    }

    getDOMFromContentModel(model: ContentModelDocument): [DocumentFragment, SelectionRangeEx] {
        return createDOMFromContentModel(
            model,
            this.isDarkMode(),
            this.getZoomScale(),
            getComputedStyles(this.contentDiv, 'direction')[0] == 'rtl',
            getDarkColor
        );
    }
}
