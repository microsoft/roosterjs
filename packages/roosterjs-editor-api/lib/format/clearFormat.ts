import execCommand from '../utils/execCommand';
import setBackgroundColor from './setBackgroundColor';
import setFontName from './setFontName';
import setFontSize from './setFontSize';
import setTextColor from './setTextColor';
import toggleBold from './toggleBold';
import toggleItalic from './toggleItalic';
import toggleUnderline from './toggleUnderline';
import { ChangeSource, DocumentCommand, QueryScope } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

const STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];

/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 */
export default function clearFormat(editor: Editor) {
    editor.focus();
    editor.addUndoSnapshot(() => {
        execCommand(editor, DocumentCommand.RemoveFormat);

        editor.queryElements('[class]', QueryScope.OnSelection, node =>
            node.removeAttribute('class')
        );

        const defaultFormat = editor.getDefaultFormat();
        const isDefaultFormatEmpty = Object.keys(defaultFormat).length === 0;
        editor.queryElements('[style]', QueryScope.InSelection, node => {
            STYLES_TO_REMOVE.forEach(style => node.style.removeProperty(style));

            // when default format is empty, keep the HTML minimum by removing style attribute if there's no style
            // (note: because default format is empty, we're not adding style back in)
            if (isDefaultFormatEmpty && node.getAttribute('style') === '') {
                node.removeAttribute('style');
            }
        });

        if (!isDefaultFormatEmpty) {
            if (defaultFormat.fontFamily) {
                setFontName(editor, defaultFormat.fontFamily);
            }
            if (defaultFormat.fontSize) {
                setFontSize(editor, defaultFormat.fontSize);
            }
            if (defaultFormat.textColor) {
                setTextColor(editor, defaultFormat.textColor);
            }
            if (defaultFormat.backgroundColor) {
                setBackgroundColor(editor, defaultFormat.backgroundColor);
            }
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
    }, ChangeSource.Format);
}
