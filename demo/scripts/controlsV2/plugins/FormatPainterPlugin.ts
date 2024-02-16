import { applySegmentFormat, getFormatState } from 'roosterjs-content-model-api';
import { MainPaneBase } from '../mainPane/MainPaneBase';
import {
    ContentModelSegmentFormat,
    EditorPlugin,
    IStandaloneEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

const FORMATPAINTERCURSOR_SVG = require('./formatpaintercursor.svg');
const FORMATPAINTERCURSOR_STYLE = `cursor: url("${FORMATPAINTERCURSOR_SVG}") 8.5 16, auto`;

export class FormatPainterPlugin implements EditorPlugin {
    private editor: IStandaloneEditor | null = null;
    private styleNode: HTMLStyleElement | null = null;
    private painterFormat: ContentModelSegmentFormat | null = null;
    private static instance: FormatPainterPlugin | undefined;

    constructor() {
        FormatPainterPlugin.instance = this;
    }

    getName() {
        return 'FormatPainter';
    }

    initialize(editor: IStandaloneEditor) {
        this.editor = editor;

        const doc = this.editor.getDocument();
        this.styleNode = doc.createElement('style');

        doc.head.appendChild(this.styleNode);
    }

    dispose() {
        this.editor = null;

        if (this.styleNode) {
            this.styleNode.parentNode?.removeChild(this.styleNode);
            this.styleNode = null;
        }
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == 'mouseUp') {
            if (this.painterFormat) {
                applySegmentFormat(this.editor, this.painterFormat);

                this.setFormatPainterCursor(null);
            }
        }
    }

    private setFormatPainterCursor(format: ContentModelSegmentFormat | null) {
        const sheet = this.styleNode.sheet;

        if (this.painterFormat) {
            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                sheet.deleteRule(i);
            }
        }

        this.painterFormat = format;

        if (this.painterFormat) {
            sheet.insertRule(`#${MainPaneBase.editorDivId} {${FORMATPAINTERCURSOR_STYLE}}`);
        }
    }

    static startFormatPainter() {
        const format = getSegmentFormat(this.instance.editor);

        if (format) {
            this.instance.setFormatPainterCursor(format);
        }
    }
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
