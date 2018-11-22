import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { getFormatState } from 'roosterjs-editor-api';

// An editor plugin to show cursor position in demo page
export default class ShowFormatState implements EditorPlugin {
    private editor: Editor;

    constructor(private resultContainer: HTMLElement) {}

    public initialize(editor: Editor) {
        this.editor = editor;
    }

    public dispose() {
        this.editor = null;
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyUp || event.eventType == PluginEventType.MouseUp || event.eventType == PluginEventType.ContentChanged) {
            let formatState = getFormatState(this.editor);
            if (formatState) {
                let result = '';
                if (formatState.fontName) {
                    result += ' <b>fontName:</b> ' + formatState.fontName;
                }
                if (formatState.fontSize) {
                    result += ' <b>fontSize:</b> ' + formatState.fontSize;
                }
                if (formatState.backgroundColor) {
                    result += ' <b>backgroundColor:</b> ' + formatState.backgroundColor;
                }
                if (formatState.textColor) {
                    result += ' <b>textColor:</b> ' + formatState.textColor;
                }
                if (formatState.isBold) {
                    result += ' <b>Bold</b> ';
                }
                if (formatState.isItalic) {
                    result += ' <b>Italic</b> ';
                }
                if (formatState.isUnderline) {
                    result += ' <b>Underline</b> ';
                }
                if (formatState.isBullet) {
                    result += ' <b>Bullet</b> ';
                }
                if (formatState.isNumbering) {
                    result += ' <b>Numbering</b> ';
                }
                if (formatState.isStrikeThrough) {
                    result += ' <b>StrikeThrough</b> ';
                }
                if (formatState.isSubscript) {
                    result += ' <b>Subscript</b> ';
                }
                if (formatState.isSuperscript) {
                    result += ' <b>Superscript</b> ';
                }
                if (formatState.canUndo) {
                    result += ' <b>CanUndo</b> ';
                }
                if (formatState.canRedo) {
                    result += ' <b>CanReDo</b> ';
                }
                if (formatState.canUnlink) {
                    result += ' <b>CanUnlink</b>';
                }
                if (formatState.canAddImageAltText) {
                    result += ' <b>CanAddImageAltText</b>';
                }
                if (formatState.headerLevel > 0) {
                    result += ` <b>Header${formatState.headerLevel}</b>`;
                }

                this.resultContainer.innerHTML = result;
            }
        }
    }
}
