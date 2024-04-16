import { CodeElement } from './CodeElement';
import { MarkdownOptions } from 'roosterjs-content-model-plugins';

export class MarkdownCode extends CodeElement {
    constructor(private markdownOptions: MarkdownOptions) {
        super();
    }

    getCode() {
        return `new roosterjs.MarkdownPlugin({
            bold: ${this.markdownOptions.bold},
            italic: ${this.markdownOptions.italic},
            strikethrough: ${this.markdownOptions.strikethrough},
            codeFormat: ${JSON.stringify(this.markdownOptions.codeFormat)},
        })`;
    }
}
