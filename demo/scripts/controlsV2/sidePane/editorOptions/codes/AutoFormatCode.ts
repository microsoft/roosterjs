import { AutoFormatOptions } from 'roosterjs-content-model-plugins';
import { CodeElement } from './CodeElement';

export class AutoFormatCode extends CodeElement {
    constructor(private options: AutoFormatOptions) {
        super();
    }

    getCode() {
        return `new roosterjs.AutoFormatPlugin({
            autoBullet: ${this.options.autoBullet},
            autoLink: ${this.options.autoLink},
            autoNumbering: ${this.options.autoNumbering},
            autoUnlink: ${this.options.autoUnlink},
            autoHyphen: ${this.options.autoHyphen},
            autoFraction: ${this.options.autoFraction},
            autoOrdinals: ${this.options.autoOrdinals},
        })`;
    }
}
