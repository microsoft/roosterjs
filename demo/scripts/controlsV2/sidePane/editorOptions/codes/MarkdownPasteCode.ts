import { CodeElement } from './CodeElement';
import type { MarkdownPasteOptions } from 'roosterjs-content-model-markdown';

export class MarkdownPasteCode extends CodeElement {
    constructor(private markdownPasteOptions: MarkdownPasteOptions) {
        super();
    }

    getCode() {
        return `new roosterjs.MarkdownPastePlugin({
            autoConversion: ${this.markdownPasteOptions.autoConversion},
            undoConversion: ${this.markdownPasteOptions.undoConversion},
            math: ${!!this.markdownPasteOptions.math},
        })`;
    }
}
