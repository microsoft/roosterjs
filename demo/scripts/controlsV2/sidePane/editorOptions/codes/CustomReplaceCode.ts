import { CodeElement } from './CodeElement';
import { CustomReplace } from 'roosterjs-content-model-plugins';

export class CustomReplaceCode extends CodeElement {
    constructor(private replacements: CustomReplace[]) {
        super();
    }

    getCode() {
        return `new roosterjs.CustomReplacePlugin(${this.replacements})`;
    }
}
