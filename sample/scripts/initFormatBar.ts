import {
    clearFormat,
    createLink,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBullet,
    toggleNumbering,
    toggleStrikethrough,
    toggleSuperscript,
    toggleSubscript,
    setIndentation,
    setAlignment,
    setFontName,
    setFontSize,
    setTextColor,
    setBackgroundColor,
    toggleBlockQuote,
    removeLink,
} from 'roosterjs-editor-api';
import { Alignment, Indentation } from 'roosterjs-editor-types';
import getCurrentEditor from './currentEditor';

export default function initFormatBar() {
    // Bold
    document.getElementById('boldButton').addEventListener('click', function() {
        toggleBold(getCurrentEditor());
    });

    // Italic
    document.getElementById('italicButton').addEventListener('click', function() {
        toggleItalic(getCurrentEditor());
    });

    // Underline
    document.getElementById('underlineButton').addEventListener('click', function() {
        toggleUnderline(getCurrentEditor());
    });

    // Bullets
    document.getElementById('bulletButton').addEventListener('click', function() {
        toggleBullet(getCurrentEditor());
    });

    // Numbering
    document.getElementById('numberingButton').addEventListener('click', function() {
        toggleNumbering(getCurrentEditor());
    });

    // Blockquote
    document.getElementById('blockquoteButton').addEventListener('click', function() {
        toggleBlockQuote(getCurrentEditor());
    });

    // StrikeThrough
    document.getElementById('strikeThroughButton').addEventListener('click', function() {
        toggleStrikethrough(getCurrentEditor());
    });

    // SuperScript
    document.getElementById('superScriptButton').addEventListener('click', function() {
        toggleSuperscript(getCurrentEditor());
    });

    // SubScript
    document.getElementById('subScriptButton').addEventListener('click', function() {
        toggleSubscript(getCurrentEditor());
    });

    // Insert link
    document.getElementById('insertLink').addEventListener('click', function() {
        let editor = getCurrentEditor();
        let range = editor.getSelectionRange();
        let url = window.prompt('Url', 'http://');
        let text = range.collapsed ? window.prompt('Text of link', url) : null;
        createLink(editor, url, url, text);
    });

    // ClearFormat
    document.getElementById('clearFormatButton').addEventListener('click', function() {
        clearFormat(getCurrentEditor());
    });

    // Indent
    document.getElementById('indentButton').addEventListener('click', function() {
        setIndentation(getCurrentEditor(), Indentation.Increase);
    });

    // Outdent
    document.getElementById('outdentButton').addEventListener('click', function() {
        setIndentation(getCurrentEditor(), Indentation.Decrease);
    });

    // AlignLeft
    document.getElementById('alignLeftButton').addEventListener('click', function() {
        setAlignment(getCurrentEditor(), Alignment.Left);
    });

    // AlignCenter
    document.getElementById('alignCenterButton').addEventListener('click', function() {
        setAlignment(getCurrentEditor(), Alignment.Center);
    });

    // AlignRight
    document.getElementById('alignRightButton').addEventListener('click', function() {
        setAlignment(getCurrentEditor(), Alignment.Right);
    });

    // undo
    document.getElementById('undoButton').addEventListener('click', function() {
        let editor = getCurrentEditor();
        editor.focus();
        editor.undo();
    });

    // redo
    document.getElementById('redoButton').addEventListener('click', function() {
        let editor = getCurrentEditor();
        editor.focus();
        editor.redo();
    });

    // remove link
    document.getElementById('removeLink').addEventListener('click', function() {
        let editor = getCurrentEditor();
        editor.focus();
        removeLink(editor);
    });

    // font name
    document.getElementById('fontNameButton').addEventListener('change', function() {
        let editor = getCurrentEditor();
        let select = document.getElementById('fontNameButton') as HTMLSelectElement;
        let text = select.value;
        if (text) {
            setFontName(editor, text);
        }
        select.value = '';
    });

    // font size
    document.getElementById('fontSizeButton').addEventListener('change', function() {
        let editor = getCurrentEditor();
        let select = document.getElementById('fontSizeButton') as HTMLSelectElement;
        let text = select.value;
        if (text) {
            setFontSize(editor, text + 'px');
        }
        select.value = '';
    });

    // text color
    document.getElementById('textColorButton').addEventListener('change', function() {
        let editor = getCurrentEditor();
        let select = document.getElementById('textColorButton') as HTMLSelectElement;
        let text = select.value;
        if (text) {
            setTextColor(editor, text);
        }
        select.value = '';
    });

    // back color
    document.getElementById('backColorButton').addEventListener('change', function() {
        let editor = getCurrentEditor();
        let select = document.getElementById('backColorButton') as HTMLSelectElement;
        let text = select.value;
        if (text) {
            setBackgroundColor(editor, text);
        }
        select.value = '';
    });
}
