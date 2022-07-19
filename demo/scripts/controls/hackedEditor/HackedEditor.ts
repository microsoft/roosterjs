import { ContentModelDocument, createContentModelFromDOM } from 'roosterjs-content-model';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';

export default class HackedEditor extends Editor {
    constructor(private contentDiv: HTMLDivElement, options?: EditorOptions) {
        super(contentDiv, options);
    }

    getContentModel(): ContentModelDocument {
        return createContentModelFromDOM(this.contentDiv, this.getSelectionRange());
    }
}
