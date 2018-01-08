import ShowCursorPosition from './plugins/ShowCursorPosition';
import ShowFromState from './plugins/ShowFormatState';
import { DefaultFormat } from 'roosterjs-editor-types';
import {
    DefaultShortcut,
    HyperLink,
    PasteManager,
    ContentEdit,
    Watermark,
} from 'roosterjs-editor-plugins';
import { ImageResizePlugin } from 'roosterjs-plugin-image-resize';
import { Editor, EditorPlugin, EditorOptions } from 'roosterjs-editor-core';
import { setCurrentEditor } from './currentEditor';
import getCurrentEditor from './currentEditor';

function initOptions() {
    document.getElementById('setEditorOptions').addEventListener('click', initEditorForOptions);
    document.getElementById('showHtmlContent').addEventListener('click', () => {
        window.alert(getCurrentEditor().getContent(true));
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
    if ((document.getElementById('pasteManagerCheckbox') as HTMLInputElement).checked) {
        plugins.push(new PasteManager(null, true));
    }
    if ((document.getElementById('contentEditCheckbox') as HTMLInputElement).checked) {
        plugins.push(new ContentEdit());
    }

    if ((document.getElementById('watermarkCheckbox') as HTMLInputElement).checked) {
        plugins.push(new Watermark('Type content here...'));
    }

    if ((document.getElementById('imageResizeCheckbox') as HTMLInputElement).checked) {
        plugins.push(new ImageResizePlugin());
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
    defaultFormat.textColor = (document.getElementById(
        'textColorDefaultFormat'
    ) as HTMLInputElement).value;
    defaultFormat.fontFamily = (document.getElementById(
        'fontNameDefaultFormat'
    ) as HTMLInputElement).value;
    let editorOptions: EditorOptions = {
        plugins: plugins,
        defaultFormat: defaultFormat,
    };

    setCurrentEditor(
        new Editor(document.getElementById('editor') as HTMLDivElement, editorOptions)
    );
}

export default initOptions;
