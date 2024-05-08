import { CodeElement } from './CodeElement';
import { ContentModelSegmentFormatCommon } from 'roosterjs-content-model-types';

export class DefaultFormatCode extends CodeElement {
    constructor(private defaultFormat: ContentModelSegmentFormatCommon) {
        super();
    }

    getCode() {
        let {
            fontWeight,
            italic,
            underline,
            fontFamily,
            fontSize,
            textColor,
            backgroundColor,
        } = this.defaultFormat;
        let lines = [
            fontWeight ? `fontWeight: '${fontWeight}',\n` : null,
            italic ? 'italic: true,\n' : null,
            underline ? 'underline: true,\n' : null,
            fontFamily ? `fontFamily: '${this.encode(fontFamily)}',\n` : null,
            fontSize ? `fontSize: '${this.encode(fontSize)}',\n` : null,
            textColor ? `textColor: '${this.encode(textColor)}',\n` : null,
            backgroundColor ? `backgroundColor: '${this.encode(backgroundColor)}',\n` : null,
        ].filter(line => !!line);

        return lines.length > 0 ? '{\n' + this.indent(lines.join('')) + '}' : '';
    }
}
