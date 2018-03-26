import setBackgroundColor from './setBackgroundColor';
import setFontName from './setFontName';
import setFontSize from './setFontSize';
import setTextColor from './setTextColor';
import { Editor } from 'roosterjs-editor-core';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';

const STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];

/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 */
export default function clearFormat(editor: Editor) {
    editor.focus();
    editor.formatWithUndo(() => {
        editor.getDocument().execCommand('removeFormat', false, null);

        queryNodesWithSelection<HTMLElement>(editor, '[class]', false /*containsOnly*/, node =>
            node.removeAttribute('class')
        );
        queryNodesWithSelection<HTMLElement>(
            editor,
            '[style]',
            true /*nodeContainedByRangeOnly*/,
            node => STYLES_TO_REMOVE.forEach(style => node.style.removeProperty(style))
        );

        let defaultFormat = editor.getDefaultFormat();
        setFontName(editor, defaultFormat.fontFamily);
        setFontSize(editor, defaultFormat.fontSize);
        setTextColor(editor, defaultFormat.textColor);
        setBackgroundColor(editor, defaultFormat.backgroundColor);
    });
}
