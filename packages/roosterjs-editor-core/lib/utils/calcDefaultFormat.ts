import { DefaultFormat } from 'roosterjs-editor-types';
import { getComputedStyle } from 'roosterjs-editor-dom';

export default function calcDefaultFormat(node: Node, baseFormat: DefaultFormat): DefaultFormat {
    baseFormat = baseFormat || <DefaultFormat>{};
    return {
        fontFamily: baseFormat.fontFamily || getComputedStyle(node, 'font-family'),
        fontSize: baseFormat.fontSize || getComputedStyle(node, 'font-size'),
        textColor: baseFormat.textColor || getComputedStyle(node, 'color'),
        backgroundColor: baseFormat.backgroundColor || getComputedStyle(node, 'background-color'),
        bold: baseFormat.bold,
        italic: baseFormat.italic,
        underline: baseFormat.underline,
    };
}
