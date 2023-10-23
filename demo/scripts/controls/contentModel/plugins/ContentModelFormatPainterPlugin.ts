import { ContentModelEditorPlugin } from 'roosterjs-content-model-editor/lib/publicTypes/ContentModelEditorPlugin';
import { ContentModelPluginEvent } from 'roosterjs-content-model-editor/lib/publicTypes/event/ContentModelPluginEvent';
// import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import {
    // applySegmentFormat,
    // getFormatState,
    IContentModelEditor,
} from 'roosterjs-content-model-editor';

// const FORMATPAINTERCURSOR_SVG = require('./formatpaintercursor.svg');
// const FORMATPAINTERCURSOR_STYLE = `;cursor: url("${FORMATPAINTERCURSOR_SVG}") 8.5 16, auto`;
// const CURSOR_REGEX = /;?\s*cursor:\s*url\(\".*?\"\)[^;]*/gi;

// interface FormatPainterFormatHolder {
//     format: ContentModelSegmentFormat | null;
// }

export default class ContentModelFormatPainterPlugin implements ContentModelEditorPlugin {
    private editor: IContentModelEditor | null = null;

    getName() {
        return 'FormatPainter';
    }

    initialize(editor: IContentModelEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: ContentModelPluginEvent) {
        if (this.editor && event.eventType == 'mouseUp') {
            // const formatHolder = getFormatHolder(this.editor);
            // if (formatHolder.format) {
            //     applySegmentFormat(this.editor, formatHolder.format);
            //     formatHolder.format = null;
            //     setFormatPainterCursor(this.editor, false /*isOn*/);
            // }
        }
    }

    static startFormatPainter(editor: IContentModelEditor) {
        // const formatHolder = getFormatHolder(editor);
        // const format = getSegmentFormat(editor);
        // if (format) {
        //     formatHolder.format = { ...format };
        //     setFormatPainterCursor(editor, true /*isOn*/);
        // }
    }
}

// function getFormatHolder(editor: IContentModelEditor): FormatPainterFormatHolder {
//     return editor.getCustomData('__FormatPainterFormat', () => {
//         return {} as FormatPainterFormatHolder;
//     });
// }

// function setFormatPainterCursor(editor: IContentModelEditor, isOn: boolean) {
//     let styles = editor.getEditorDomAttribute('style') || '';
//     styles = styles.replace(CURSOR_REGEX, '');

//     if (isOn) {
//         styles += FORMATPAINTERCURSOR_STYLE;
//     }

//     editor.setEditorDomAttribute('style', styles);
// }

// function getSegmentFormat(editor: IContentModelEditor): ContentModelSegmentFormat {
//     const formatState = getFormatState(editor);

//     return {
//         backgroundColor: formatState.backgroundColor,
//         fontFamily: formatState.fontName,
//         fontSize: formatState.fontSize,
//         fontWeight: formatState.isBold ? 'bold' : 'normal',
//         italic: formatState.isItalic,
//         letterSpacing: formatState.letterSpacing,
//         strikethrough: formatState.isStrikeThrough,
//         superOrSubScriptSequence: formatState.isSubscript
//             ? 'sub'
//             : formatState.isSuperscript
//             ? 'super'
//             : '',
//         textColor: formatState.textColor,
//         underline: formatState.isUnderline,
//     };
// }
