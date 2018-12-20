import CodeElement from './CodeElement';

export default class WatermarkCode extends CodeElement {
    constructor(private watermarkText: string) {
        super();
    }

    getImports() {
        return [
            {
                name: 'Watermark',
                path: 'roosterjs-editor-plugins',
                isDefault: false,
            },
        ];
    }

    getCode() {
        return `new Watermark('${this.encode(this.watermarkText)}')`;
    }
}
