import execFormatWithUndo from './execFormatWithUndo';
import setBackgroundColor from './setBackgroundColor';
import toggleBold from './toggleBold';
import toggleItalic from './toggleItalic';
import toggleUnderline from './toggleUnderline';
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
    // We have no way if this clear format will really result in any DOM change
    // Let's just do it with undo
    execFormatWithUndo(editor, () => {
        editor.runWithoutAddingUndoSnapshot(() => {
            editor.getDocument().execCommand('removeFormat', false, null);

            let nodes = queryNodesWithSelection(editor, '[class]');
            for (const node of nodes) {
                (<HTMLElement>node).removeAttribute('class');
            }

            const defaultFormat = editor.getDefaultFormat();
            const isDefaultFormatEmpty = Object.keys(defaultFormat).length === 0;
            nodes = queryNodesWithSelection(editor, '[style]', true /*nodeContainedByRangeOnly*/);
            for (const node of nodes) {
                STYLES_TO_REMOVE.forEach(style => (<HTMLElement>node).style.removeProperty(style));

                // when default format is empty, keep the HTML minimum by removing style attribute if there's no style
                // (note: because default format is empty, we're not adding style back in)
                if (isDefaultFormatEmpty && node.getAttribute('style') === '') {
                    node.removeAttribute('style');
                }
            }

            if (!isDefaultFormatEmpty) {
                setFontName(editor, defaultFormat.fontFamily);
                setFontSize(editor, defaultFormat.fontSize);
                setTextColor(editor, defaultFormat.textColor);
                setBackgroundColor(editor, defaultFormat.backgroundColor);
                if (defaultFormat.bold) {
                    toggleBold(editor);
                }
                if (defaultFormat.italic) {
                    toggleItalic(editor);
                }
                if (defaultFormat.underline) {
                    toggleUnderline(editor);
                }
            }
        });
    });
}
