import clearBlockFormat from '../format/clearBlockFormat';
import execCommand from '../utils/execCommand';
import PartialInlineElement from 'roosterjs-editor-dom/lib/inlineElements/PartialInlineElement';
import setBackgroundColor from './setBackgroundColor';
import setFontName from './setFontName';
import setFontSize from './setFontSize';
import setTextColor from './setTextColor';
import toggleBold from './toggleBold';
import toggleItalic from './toggleItalic';
import toggleUnderline from './toggleUnderline';
import { ChangeSource, DocumentCommand, IEditor, QueryScope } from 'roosterjs-editor-types';

const STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];

export const enum FormattingStrategy {
    /**
     * Inline format. Remove text format.
     */
    Inline,

    /**
     * BLock format. Remove text and structure format of the block.
     */
    Block,

    /**
     * Detect Inline or Block format based on the current editor selectior.
     */
    AutoDetect,
}

/**
 * @param editor The editor instance
 * @returns if the current selection is composed of two or more block elements
 */
function isMultiBlockSelection(editor: IEditor): boolean {
    let transverser = editor.getSelectionTraverser();
    let blockElement = transverser.currentBlockElement;
    if (!blockElement) {
        return false;
    }

    let nextBlockElement = transverser.getNextBlockElement();

    //At least two blocks are selected
    return !!nextBlockElement;
}

/**
 * Clear the format of the selected text or list of blocks
 * If the current selection is compose of multiple block elements then remove the text and struture format for all the selected blocks
 * If the current selection is compose of a partial inline element then only the text format is removed from the current selection
 * @param editor The editor instance
 */
function clearAutoDetectFormat(editor: IEditor) {
    const isMultiBlock = isMultiBlockSelection(editor);
    if (!isMultiBlock) {
        const transverser = editor.getSelectionTraverser();
        const inlineElement = transverser.currentInlineElement;
        const isPartial = inlineElement instanceof PartialInlineElement;
        if (isPartial) {
            clearFormat(editor);
            return;
        }
    }
    clearBlockFormat(editor);
}

function clearInlineFormat(editor: IEditor) {
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
                if (defaultFormat.textColors) {
                    setTextColor(editor, defaultFormat.textColors);
                } else {
                    setTextColor(editor, defaultFormat.textColor);
                }
            }
            if (defaultFormat.backgroundColor) {
                if (defaultFormat.backgroundColors) {
                    setBackgroundColor(editor, defaultFormat.backgroundColors);
                } else {
                    setBackgroundColor(editor, defaultFormat.backgroundColor);
                }
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

/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 * @param formatType type of format to apply
 */
export default function clearFormat(
    editor: IEditor,
    formatType: FormattingStrategy = FormattingStrategy.Inline
) {
    if (formatType == FormattingStrategy.Inline) {
        clearInlineFormat(editor);
    } else if (formatType == FormattingStrategy.Block) {
        clearBlockFormat(editor);
    } else {
        clearAutoDetectFormat(editor);
    }
}
