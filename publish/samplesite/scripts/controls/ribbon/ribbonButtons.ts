import MainPaneBase from '../MainPaneBase';
import renderInsertLinkDialog from './renderInsertLinkDialog';
import RibbonButtonType from './RibbonButtonType';
import { Alignment, Direction, Indentation } from 'roosterjs-editor-types';
import { getPlugins } from '../plugins';
import {
    setBackgroundColor,
    setFontName,
    setFontSize,
    setTextColor,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBullet,
    toggleNumbering,
    setIndentation,
    setAlignment,
    toggleBlockQuote,
    removeLink,
    toggleSuperscript,
    toggleSubscript,
    toggleStrikethrough,
    setDirection,
    clearBlockFormat,
    clearFormat,
    toggleHeader,
    toggleCodeBlock,
    insertImage,
} from 'roosterjs-editor-api';

const buttons: { [key: string]: RibbonButtonType } = {
    bold: {
        title: 'Bold',
        image: require('./svg/bold.svg'),
        onClick: toggleBold,
    },
    italic: {
        title: 'Italic',
        image: require('./svg/italic.svg'),
        onClick: toggleItalic,
    },
    underline: {
        title: 'Underline',
        image: require('./svg/underline.svg'),
        onClick: toggleUnderline,
    },
    fontName: {
        title: 'Font',
        image: require('./svg/fontname.svg'),
        onClick: setFontName,
        dropDownItems: {
            Arial: 'Arial',
            Calibri: 'Calibri',
            'Courier New': 'Courier New',
            Tahoma: 'Tahoma',
            'Times New Roman': 'Times New Roman',
        },
    },
    fontSize: {
        title: 'Font size',
        image: require('./svg/fontsize.svg'),
        onClick: setFontSize,
        dropDownItems: {
            '8pt': '8',
            '10pt': '10',
            '12pt': '12',
            '16pt': '16',
            '20pt': '20',
            '36pt': '36',
            '72pt': '72',
        },
    },
    textColor: {
        title: 'Text color',
        image: require('./svg/textcolor.svg'),
        onClick: setTextColor,
        dropDownItems: {
            '#757b80': 'Gray',
            '#bd1398': 'Violet',
            '#7232ad': 'Purple',
            '#006fc9': 'Blue',
            '#4ba524': 'Green',
            '#e2c501': 'Yellow',
            '#d05c12': 'Orange',
            '#ff0000': 'Red',
            '#ffffff': 'White',
            '#000000': 'Black',
        },
    },
    backColor: {
        title: 'Highlight',
        image: require('./svg/backcolor.svg'),
        onClick: setBackgroundColor,
        dropDownItems: {
            '#ffff00': 'Yellow',
            '#00ff00': 'Green',
            '#00ffff': 'Cyan',
            '#ff00ff': 'Purple',
            '#0000ff': 'Blue',
            '#ff0000': 'Red',
            '#bebebe': 'Gray',
            '#666666': 'Dark Gray',
            '#ffffff': 'White',
            '#000000': 'Black',
        },
    },
    bullet: {
        title: 'Bullet',
        image: require('./svg/bullets.svg'),
        onClick: toggleBullet,
    },
    numbering: {
        title: 'Numbering',
        image: require('./svg/numbering.svg'),
        onClick: toggleNumbering,
    },
    outdent: {
        title: 'Decrease indent',
        image: require('./svg/outdent.svg'),
        onClick: editor => setIndentation(editor, Indentation.Decrease),
    },
    indent: {
        title: 'Increase indent',
        image: require('./svg/indent.svg'),
        onClick: editor => setIndentation(editor, Indentation.Increase),
    },
    blockQuote: {
        title: 'Quote',
        image: require('./svg/blockquote.svg'),
        onClick: editor => toggleBlockQuote(editor),
    },
    alignLeft: {
        title: 'Align left',
        image: require('./svg/alignleft.svg'),
        onClick: editor => setAlignment(editor, Alignment.Left),
    },
    alignCenter: {
        title: 'Align center',
        image: require('./svg/aligncenter.svg'),
        onClick: editor => setAlignment(editor, Alignment.Center),
    },
    alignRight: {
        title: 'Align right',
        image: require('./svg/alignright.svg'),
        onClick: editor => setAlignment(editor, Alignment.Right),
    },
    insertLink: {
        title: 'Insert hyperlink',
        image: require('./svg/createlink.svg'),
        onClick: null,
        dropDownItems: { '0': 'dummy' },
        dropDownRenderer: renderInsertLinkDialog,
        preserveOnClickAway: true,
    },
    unlink: {
        title: 'Remove hyperlink',
        image: require('./svg/unlink.svg'),
        onClick: removeLink,
    },
    insertImage: {
        title: 'Insert inline image',
        image: require('./svg/inlineimage.svg'),
        onClick: editor => {
            let fileInput = document.createElement('input') as HTMLInputElement;
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', () => {
                let file = fileInput.files[0];
                if (file) {
                    insertImage(editor, file);
                }
            });
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        },
    },
    superscript: {
        title: 'Superscript',
        image: require('./svg/superscript.svg'),
        onClick: toggleSuperscript,
    },
    subscript: {
        title: 'Subscript',
        image: require('./svg/subscript.svg'),
        onClick: toggleSubscript,
    },
    strikethrough: {
        title: 'Strikethrough',
        image: require('./svg/strikethrough.svg'),
        onClick: toggleStrikethrough,
    },
    header: {
        title: 'Header',
        image: require('./svg/header.svg'),
        onClick: (editor, value) => toggleHeader(editor, parseInt(value)),
        dropDownItems: {
            '0': 'No header',
            '1': 'Header 1',
            '2': 'Header 2',
            '3': 'Header 3',
            '4': 'Header 4',
            '5': 'Header 5',
            '6': 'Header 6',
        },
    },
    code: {
        title: 'Code block',
        image: require('./svg/code.svg'),
        onClick: editor => toggleCodeBlock(editor),
    },
    ltr: {
        title: 'Left-to-right',
        image: require('./svg/ltr.svg'),
        onClick: editor => setDirection(editor, Direction.LeftToRight),
    },
    rtl: {
        title: 'Right-to-left',
        image: require('./svg/rtl.svg'),
        onClick: editor => setDirection(editor, Direction.RightToLeft),
    },
    undo: {
        title: 'Undo',
        image: require('./svg/undo.svg'),
        onClick: editor => editor.undo(),
    },
    redo: {
        title: 'Redo',
        image: require('./svg/redo.svg'),
        onClick: editor => editor.redo(),
    },
    clearFormat: {
        title: 'Remove formatting',
        image: require('./svg/removeformat.svg'),
        onClick: (editor, key) => (key == 'block' ? clearBlockFormat(editor) : clearFormat(editor)),
        dropDownItems: {
            selection: 'Remove formatting of selected text',
            block: 'Remove formatting of selected paragraphs',
        },
    },
    table: {
        title: 'Show table options',
        image: require('./svg/table.svg'),
        onClick: () => showTableOptions(),
    },
};

export default buttons;

function showTableOptions() {
    let plugins = getPlugins();
    window.location.hash = plugins.tableOptions.getName();
}
