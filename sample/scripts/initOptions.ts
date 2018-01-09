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
import updateSampleCode from './updateSampleCode';

function initOptions() {
    document.getElementById('showHtmlContent').addEventListener('click', () => {
        window.alert(getCurrentEditor().getContent(true));
    });
    document.getElementById('defaultShortcutCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('hyperlinkCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('pasteManagerCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('contentEditCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('watermarkCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('imageResizeCheckbox').addEventListener('change', initEditorForOptions);

    document.getElementById('boldCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('italicCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('underlineCheckbox').addEventListener('change', initEditorForOptions);
    document.getElementById('textColorDefaultFormat').addEventListener('change', initEditorForOptions);
    document.getElementById('fontNameDefaultFormat').addEventListener('change', initEditorForOptions);
}

function initEditorForOptions() {
    setCurrentEditor(null);

    let plugins: EditorPlugin[] = [];
    if ((document.getElementById('defaultShortcutCheckbox') as HTMLInputElement).checked) {
        plugins.push(new DefaultShortcut());
    }
    if ((document.getElementById('hyperlinkCheckbox') as HTMLInputElement).checked) {
        plugins.push(new HyperLink());
    }
    if ((document.getElementById('pasteManagerCheckbox') as HTMLInputElement).checked) {
        plugins.push(new PasteManager());
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

    updateSampleCode(plugins, defaultFormat);
}

export default initOptions;
