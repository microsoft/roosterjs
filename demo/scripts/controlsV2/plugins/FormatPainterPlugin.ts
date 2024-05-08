import { applySegmentFormat, getFormatState } from 'roosterjs-content-model-api';
import {
    ContentModelSegmentFormatCommon,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

const FORMATPAINTERCURSOR_SVG = require('./formatpaintercursor.svg');
const FORMATPAINTERCURSOR_STYLE = `cursor: url("${FORMATPAINTERCURSOR_SVG}") 8.5 16, auto`;
const FORMAT_PAINTER_STYLE_KEY = '_FormatPainter';

/**
 * Format painter handler works together with a format painter button tot let implement format painter functioinality
 */
export interface FormatPainterHandler {
    /**
     * Let editor enter format painter state
     */
    startFormatPainter(): void;
}

/**
 * Format painter plugin helps implement format painter functionality.
 * To use this plugin, you need a button to let editor enter format painter state by calling formatPainterPlugin.startFormatPainter(),
 * then this plugin will handle the rest work.
 */
export class FormatPainterPlugin implements EditorPlugin, FormatPainterHandler {
    private editor: IEditor | null = null;
    private painterFormat: ContentModelSegmentFormatCommon | null = null;

    getName() {
        return 'FormatPainter';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == 'mouseUp') {
            if (this.painterFormat) {
                applySegmentFormat(this.editor, this.painterFormat);

                this.setFormatPainterCursor(null);
            }
        }
    }

    private setFormatPainterCursor(format: ContentModelSegmentFormatCommon | null) {
        this.painterFormat = format;

        this.editor?.setEditorStyle(
            FORMAT_PAINTER_STYLE_KEY,
            this.painterFormat ? FORMATPAINTERCURSOR_STYLE : null
        );
    }

    startFormatPainter() {
        if (this.editor) {
            const format = getSegmentFormat(this.editor);

            this.setFormatPainterCursor(format);
        }
    }
}

function getSegmentFormat(editor: IEditor): ContentModelSegmentFormatCommon {
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
