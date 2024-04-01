import { AutoFormatOptions } from 'roosterjs-content-model-plugins';
import { CodeElement } from './CodeElement';

export class AutoFormatCode extends CodeElement {
    constructor(private options: AutoFormatOptions) {
        super();
    }

    getCode() {
        return `new roosterjs.AutoFormatPlugin('${this.options}')`;
    }
}
