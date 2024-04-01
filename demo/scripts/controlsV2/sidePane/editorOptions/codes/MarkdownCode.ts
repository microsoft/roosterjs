import { CodeElement } from './CodeElement';
import { MarkdownOptions } from 'roosterjs-content-model-plugins';

export class MarkdownCode extends CodeElement {
    constructor(private markdownOptions: MarkdownOptions) {
        super();
    }

    getCode() {
        return `new roosterjs.MarkdownPlugin('${this.markdownOptions}')`;
    }
}
