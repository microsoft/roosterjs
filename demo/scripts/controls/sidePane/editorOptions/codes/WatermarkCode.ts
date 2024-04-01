import CodeElement from './CodeElement';

export default class WatermarkCode extends CodeElement {
    constructor(private watermarkText: string) {
        super();
    }

    getCode() {
        return `new roosterjsLegacy.Watermark('${this.encode(this.watermarkText)}')`;
    }
}
