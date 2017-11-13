import execFormatWithUndo from './execFormatWithUndo';
import { Editor, browserData } from 'roosterjs-editor-core';
import setFontName from './setFontName';
import setFontSize from './setFontSize';
import setTextColor from './setTextColor';
import setBackgroundColor from './setBackgroundColor';

export default function clearFormat(editor: Editor): void {
    editor.focus();
    // We have no way if this clear format will really result in any DOM change
    // Let's just do it with undo
    execFormatWithUndo(editor, () => {
        editor.runWithoutAddingUndoSnapshot(() => {
            editor.getDocument().execCommand('removeFormat', false, null);

            if (browserData.isEdge || browserData.isIE) {
                let defaultFormat = editor.getDefaultFormat();
                setFontName(editor, defaultFormat.fontFamily);
                setFontSize(editor, defaultFormat.fontSize);
                setTextColor(editor, defaultFormat.textColor);
                setBackgroundColor(editor, defaultFormat.backgroundColor);
            }
        });
    });
}
