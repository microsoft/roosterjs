import {
    clearBlockFormat,
    clearFormat,
    createLink,
    insertImage,
    insertTable,
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
    setDirection,
    setFontName,
    setFontSize,
    setTextColor,
    setBackgroundColor,
    toggleBlockQuote,
    toggleCodeBlock,
    removeLink,
    toggleHeader,
    editTable,
    formatTable,
} from 'roosterjs-editor-api';
import {
    Alignment,
    Direction,
    Indentation,
    QueryScope,
    TableOperation,
    TableFormat,
} from 'roosterjs-editor-types';
import getCurrentEditor from './currentEditor';
import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

let TABLE_FORMAT = [
    createTableFormat('#FFF', '#FFF', '#ABABAB', '#ABABAB', '#ABABAB'),
    createTableFormat('#FFF', '#FFF', null, '#92C0E0'),
    createTableFormat('#C0E4FF', '#FFF'),
    createTableFormat('#D8D8D8', '#FFF'),
    createTableFormat('#D8D8D8', '#FFF', '#ABABAB', '#ABABAB', '#ABABAB'),
    createTableFormat('#FFF', '#FFF'),
];

function createTableFormat(
    bgColorEven?: string,
    bgColorOdd?: string,
    topBorder?: string,
    bottomBorder?: string,
    verticalBorder?: string
): TableFormat {
    return {
        bgColorEven: bgColorEven,
        bgColorOdd: bgColorOdd,
        topBorderColor: topBorder,
        bottomBorderColor: bottomBorder,
        verticalBorderColor: verticalBorder,
    };
}

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

    // Code
    document.getElementById('codeButton').addEventListener('click', function() {
        toggleCodeBlock(getCurrentEditor());
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
        let existingLink = editor.queryElements('a[href]', QueryScope.OnSelection)[0] as HTMLAnchorElement;
        let url = window.prompt('Url', existingLink ? existingLink.href : 'http://');
        let text = window.prompt(
            'Text of link',
            existingLink ? existingLink.textContent : range.collapsed ? url : range.toString()
        );
        createLink(editor, url, url, text);
    });

    // ClearFormat
    document.getElementById('clearFormatButton').addEventListener('click', function() {
        clearFormat(getCurrentEditor());
    });

    // ClearBlockFormat
    document.getElementById('clearBlockFormatButton').addEventListener('click', function() {
        clearBlockFormat(getCurrentEditor());
    });

    // Edit table
    document.getElementById('editTable').addEventListener('change', function() {
        let select = document.getElementById('editTable') as HTMLSelectElement;
        let intValue = parseInt(select.value);
        if (intValue >= 0) {
            let operation = <TableOperation>intValue;
            editTable(getCurrentEditor(), operation);
            select.value = '-1';
        }
    });

    document.getElementById('formatTable').addEventListener('change', function() {
        let select = document.getElementById('formatTable') as HTMLSelectElement;
        let intValue = parseInt(select.value);
        if (intValue >= 0) {
            formatTable(getCurrentEditor(), TABLE_FORMAT[intValue]);
            select.value = '-1';
        }
    });

    // Header
    document.getElementById('header').addEventListener('change', function() {
        let select = document.getElementById('header') as HTMLSelectElement;
        let level = parseInt(select.value);
        toggleHeader(getCurrentEditor(), level);
        select.value = '-1';
    });

    // Insert Table
    document.getElementById('insertTable').addEventListener('click', function() {
        let columns = Math.min(parseInt(window.prompt('How many columns?')), 10);
        let rows = Math.min(parseInt(window.prompt('How many rows?')), 10);
        if (columns > 0 && rows > 0) {
            insertTable(getCurrentEditor(), columns, rows);
        }
    });

    // Insert Image
    document.getElementById('insertImage').addEventListener('click', function() {
        (document.getElementById('selectFile') as HTMLInputElement).click();
    });

    document.getElementById('selectFile').addEventListener('change', function() {
        let input = document.getElementById('selectFile') as HTMLInputElement;
        let file = input.files[0];
        if (file) {
            insertImage(getCurrentEditor(), file);
            input.value = '';
        }
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

    // LTR
    document.getElementById('ltr').addEventListener('click', function() {
        setDirection(getCurrentEditor(), Direction.LeftToRight);
    });

    // RTL
    document.getElementById('rtl').addEventListener('click', function() {
        setDirection(getCurrentEditor(), Direction.RightToLeft);
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
            setFontSize(editor, text + 'pt');
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

    // Sanitize HTML
    document.getElementById('sanitizeHtmlButton').addEventListener('click', function() {
        let editor = getCurrentEditor();
        let html = editor.getContent();
        html = HtmlSanitizer.sanitizeHtml(html);
        editor.setContent(html);
    });
}
