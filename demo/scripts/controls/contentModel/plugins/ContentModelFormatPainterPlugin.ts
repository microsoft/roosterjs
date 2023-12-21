import { applySegmentFormat, getFormatState } from 'roosterjs-content-model-api';
import { ContentModelSegmentFormat, IStandaloneEditor } from 'roosterjs-content-model-types';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from 'roosterjs-content-model-editor';

const FORMATPAINTERCURSOR_SVG = require('./formatpaintercursor.svg');
const FORMATPAINTERCURSOR_STYLE = `;cursor: url("${FORMATPAINTERCURSOR_SVG}") 8.5 16, auto`;
const CURSOR_REGEX = /;?\s*cursor:\s*url\(\".*?\"\)[^;]*/gi;

let painterFormat: ContentModelSegmentFormat | null = null;

export default class ContentModelFormatPainterPlugin implements EditorPlugin {
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
            if (painterFormat) {
                applySegmentFormat(this.editor, painterFormat);
                painterFormat = null;

                setFormatPainterCursor(this.editor, false /*isOn*/);
            }
        }
    }

    static startFormatPainter(editor: IStandaloneEditor) {
        const format = getSegmentFormat(editor);

        if (format) {
            painterFormat = { ...format };
            setFormatPainterCursor(editor, true /*isOn*/);
        }
    }
}

function setFormatPainterCursor(editor: IStandaloneEditor, isOn: boolean) {
    const attributes = editor.getEnvironment().domAttributes;
    const styleAttr = attributes.getNamedItem('style');
    let styles = styleAttr?.value || '';
    styles = styles.replace(CURSOR_REGEX, '');

    if (isOn) {
        styles += FORMATPAINTERCURSOR_STYLE;
    }

    styleAttr.value = styles;
}

function getSegmentFormat(editor: IStandaloneEditor): ContentModelSegmentFormat {
    const formatState = getFormatState(editor);

    return {
        backgroundColor: formatState.backgroundColor,
        fontFamily: formatState.fontName,
        fontSize: formatState.fontSize,
        fontWeight: formatState.isBold ? 'bold' : 'normal',
        italic: formatState.isItalic,
        letterSpacing: formatState.letterSpacing,
        strikethrough: formatState.isStrikeThrough,
        superOrSubScriptSequence: formatState.isSubscript
            ? 'sub'
            : formatState.isSuperscript
            ? 'super'
            : '',
        textColor: formatState.textColor,
        underline: formatState.isUnderline,
    };
}
