import { DefaultFormat } from 'roosterjs-editor-types';
import { getComputedStyle } from 'roosterjs-editor-dom';

export default function calcDefaultFormat(node: Node, baseFormat: DefaultFormat): DefaultFormat {
    baseFormat = baseFormat || <DefaultFormat>{};
    let computedStyle = getComputedStyle(node);
    return {
        fontFamily: baseFormat.fontFamily || computedStyle[0],
        fontSize: baseFormat.fontSize || computedStyle[1],
        textColor: baseFormat.textColor || computedStyle[2],
        backgroundColor: baseFormat.backgroundColor || computedStyle[3],
        bold: baseFormat.bold,
        italic: baseFormat.italic,
        underline: baseFormat.underline,
    };
}
