import ShowCursorPosition from './plugins/ShowCursorPosition';
import ShowFromState from './plugins/ShowFormatState';
import { DefaultFormat } from 'roosterjs-editor-types';
import {
    DefaultShortcut,
    HyperLink,
    Paste,
    ContentEdit,
    Watermark,
    TableResize,
} from 'roosterjs-editor-plugins';
import { ImageResize } from 'roosterjs-plugin-image-resize';
import { Editor, EditorPlugin, EditorOptions } from 'roosterjs-editor-core';
import { setCurrentEditor } from './currentEditor';
import getCurrentEditor from './currentEditor';
import updateSampleCode from './updateSampleCode';

function initOptions() {
    document.getElementById('showHtmlContent').addEventListener('click', () => {
        window.alert(getCurrentEditor().getContent(true));
    });

    document.getElementById('showTextContent').addEventListener('click', () => {
        let text = getCurrentEditor().getTextContent();
        window.alert(text);
    });

    [
        'defaultShortcutCheckbox',
        'hyperlinkCheckbox',
        'pasteCheckbox',
        'contentEditCheckbox',
        'watermarkCheckbox',
        'imageResizeCheckbox',
        'tableResizeCheckbox',
        'boldCheckbox',
        'italicCheckbox',
        'underlineCheckbox',
        'textColorDefaultFormat',
        'fontNameDefaultFormat',
    ].forEach(id => {
        document.getElementById(id).addEventListener('change', initEditorForOptions);
    });
}

export function initEditorForOptions() {
    setCurrentEditor(null);

    let plugins: EditorPlugin[] = [];
    if ((document.getElementById('defaultShortcutCheckbox') as HTMLInputElement).checked) {
        plugins.push(new DefaultShortcut());
    }
    if ((document.getElementById('hyperlinkCheckbox') as HTMLInputElement).checked) {
        plugins.push(new HyperLink());
    }
    if ((document.getElementById('pasteCheckbox') as HTMLInputElement).checked) {
        plugins.push(new Paste(true));
    }
    if ((document.getElementById('contentEditCheckbox') as HTMLInputElement).checked) {
        plugins.push(new ContentEdit());
    }

    if ((document.getElementById('watermarkCheckbox') as HTMLInputElement).checked) {
        plugins.push(new Watermark('Type content here...'));
    }

    if ((document.getElementById('imageResizeCheckbox') as HTMLInputElement).checked) {
        plugins.push(new ImageResize());
    }

    if ((document.getElementById('tableResizeCheckbox') as HTMLInputElement).checked) {
        plugins.push(new TableResize());
    }

    plugins.push(new ShowCursorPosition(document.getElementById('cursorPosition')));
    plugins.push(new ShowFromState(document.getElementById('formatState')));

    let defaultFormat: DefaultFormat = {};

    if ((document.getElementById('boldCheckbox') as HTMLInputElement).checked) {
        defaultFormat.bold = true;
    }
    if ((document.getElementById('italicCheckbox') as HTMLInputElement).checked) {
        defaultFormat.italic = true;
    }
    if ((document.getElementById('underlineCheckbox') as HTMLInputElement).checked) {
        defaultFormat.underline = true;
    }
    const textColor = (document.getElementById('textColorDefaultFormat') as HTMLInputElement).value;
    if (textColor) {
        defaultFormat.textColor = textColor;
    }
    const fontFamily = (document.getElementById('fontNameDefaultFormat') as HTMLInputElement).value;
    if (fontFamily) {
        defaultFormat.fontFamily = fontFamily;
    }
    let editorOptions: EditorOptions = {
        plugins: plugins,
        defaultFormat: defaultFormat
    };

    setCurrentEditor(
        new Editor(document.getElementById('editor') as HTMLDivElement, editorOptions)
    );

    updateSampleCode(plugins, defaultFormat);
}

export default initOptions;
