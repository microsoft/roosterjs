import { CodeElement } from './CodeElement';

export class WatermarkCode extends CodeElement {
    constructor(private watermarkText: string) {
        super();
    }

    getCode() {
        return `new roosterjs.WatermarkPlugin('${this.encode(this.watermarkText)}')`;
    }
}
