import EditorOptions from './EditorOptions';
import EditorPlugin from '../editor/EditorPlugin';
import { DefaultFormat } from 'roosterjs-editor-types';
import { InlineElementFactory } from 'roosterjs-editor-dom';
import { getComputedStyle } from 'roosterjs-editor-dom';

interface EditorCore {
    document: Document;
    contentDiv: HTMLDivElement;
    plugins: EditorPlugin[];
    inlineElementFactory: InlineElementFactory;
    defaultFormat: DefaultFormat;
    cachedRange: Range;
    customData: {
        [Key: string]: {
            value: any;
            disposer: (value: any) => void;
        };
    };
}

let EditorCore = {
    create: (contentDiv: HTMLDivElement, options: EditorOptions): EditorCore => {
        return {
            contentDiv: contentDiv,
            document: contentDiv.ownerDocument,
            inlineElementFactory: new InlineElementFactory(),
            defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
            customData: {},
            cachedRange: null,
            plugins: (options.plugins || []).filter(plugin => !!plugin),
        };
    }
}

export default EditorCore;

function calcDefaultFormat(node: Node, baseFormat: DefaultFormat): DefaultFormat {
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
