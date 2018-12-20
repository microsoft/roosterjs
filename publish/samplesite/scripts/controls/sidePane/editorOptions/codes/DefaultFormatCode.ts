import CodeElement from './CodeElement';
import { DefaultFormat } from 'roosterjs-editor-types';

export default class DefaultFormatCode extends CodeElement {
    constructor(private defaultFormat: DefaultFormat) {
        super();
    }

    getImports() {
        return [
            {
                name: 'DefaultFormat',
                path: 'roosterjs-editor-types',
                isDefault: false,
            },
        ];
    }

    getCode() {
        let {
            bold,
            italic,
            underline,
            fontFamily,
            fontSize,
            textColor,
            backgroundColor,
        } = this.defaultFormat;
        let lines = [
            bold ? 'bold: true,\n' : null,
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
