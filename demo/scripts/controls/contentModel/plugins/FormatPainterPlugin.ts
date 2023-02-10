import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    applySegmentFormat,
    ContentModelSegmentFormat,
    getSegmentFormat,
    IContentModelEditor,
} from 'roosterjs-content-model';

const FORMATPAINTERCURSOR_SVG = require('./formatpaintercursor.svg');
const FORMATPAINTERCURSOR_STYLE = `;cursor: url("${FORMATPAINTERCURSOR_SVG}") 8.5 16, auto`;
const CURSOR_REGEX = /;?\s*cursor:\s*url\(\".*?\"\)[^;]*/gi;

interface FormatPainterFormatHolder {
    format: ContentModelSegmentFormat | null;
}

export default class FormatPainterPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    getName() {
        return 'FormatPainter';
    }

    initialize(editor: IEditor) {
        this.editor = editor as IContentModelEditor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == PluginEventType.MouseUp) {
            const formatHolder = getFormatHolder(this.editor);

            if (formatHolder.format) {
                applySegmentFormat(this.editor, formatHolder.format);
                formatHolder.format = null;

                setFormatPainterCursor(this.editor, false /*isOn*/);
            }
        }
    }

    static startFormatPainter(editor: IContentModelEditor) {
        const formatHolder = getFormatHolder(editor);
        const format = getSegmentFormat(editor);

        if (format) {
            formatHolder.format = { ...format };
            setFormatPainterCursor(editor, true /*isOn*/);
        }
    }
}

function getFormatHolder(editor: IEditor): FormatPainterFormatHolder {
    return editor.getCustomData('__FormatPainterFormat', () => {
        return {} as FormatPainterFormatHolder;
    });
}

function setFormatPainterCursor(editor: IEditor, isOn: boolean) {
    let styles = editor.getEditorDomAttribute('style') || '';
    styles = styles.replace(CURSOR_REGEX, '');

    if (isOn) {
        styles += FORMATPAINTERCURSOR_STYLE;
    }

    editor.setEditorDomAttribute('style', styles);
}
