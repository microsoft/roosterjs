import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, EditorPlugin, SanitizeHtmlOptions } from 'roosterjs-editor-types';
import { HtmlSanitizer } from 'roosterjs-editor-dom';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

export function initEditor(id: string, plugins?: EditorPlugin[]) {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: EditorOptions = {
        plugins,
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };

    let editor = new Editor(node as HTMLDivElement, options);

    return editor;
}

export function callSanitizer(fragment: DocumentFragment, sanitizingOption: SanitizeHtmlOptions) {
    const sanitizer = new HtmlSanitizer(sanitizingOption);

    sanitizer.convertGlobalCssToInlineCss(fragment);
    sanitizer.sanitize(fragment);
}
