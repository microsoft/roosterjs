import execFormatWithUndo from './execFormatWithUndo';
import setBackgroundColor from './setBackgroundColor';
import setFontName from './setFontName';
import setFontSize from './setFontSize';
import setTextColor from './setTextColor';
import { Editor } from 'roosterjs-editor-core';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';

/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/left/right/center/superscript/subscript
 * @param editor The editor instance
 */
export default function clearFormat(editor: Editor) {
    editor.focus();
    // We have no way if this clear format will really result in any DOM change
    // Let's just do it with undo
    execFormatWithUndo(editor, () => {
        editor.runWithoutAddingUndoSnapshot(() => {
            editor.getDocument().execCommand('removeFormat', false, null);

            let nodes = queryNodesWithSelection(editor, '[class]');
            for (let node of nodes) {
                (<HTMLElement>node).removeAttribute('class');
            }

            let defaultFormat = editor.getDefaultFormat();
            setFontName(editor, defaultFormat.fontFamily);
            setFontSize(editor, defaultFormat.fontSize);
            setTextColor(editor, defaultFormat.textColor);
            setBackgroundColor(editor, defaultFormat.backgroundColor);
        });
    });
}
