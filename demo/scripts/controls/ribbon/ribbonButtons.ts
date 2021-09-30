import getLastClipboardData from './getLastClipboardData';
import MainPaneBase from '../MainPaneBase';
import renderInsertLinkDialog from './renderInsertLinkDialog';
import renderTableOptions from './renderTableOptions';
import RibbonButtonType from './RibbonButtonType';
import { Alignment, ClearFormatMode, Direction, Indentation } from 'roosterjs-editor-types';
import { Browser } from 'roosterjs-editor-dom';
import { getDarkColor } from 'roosterjs-color-utils';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import {
    setFontName,
    setFontSize,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBullet,
    toggleNumbering,
    setIndentation,
    changeCapitalization,
    setAlignment,
    toggleBlockQuote,
    removeLink,
    toggleSuperscript,
    toggleSubscript,
    toggleStrikethrough,
    setDirection,
    clearFormat,
    toggleHeader,
    toggleCodeBlock,
    insertImage,
    setTextColor,
    setBackgroundColor,
} from 'roosterjs-editor-api';

const buttons: { [key: string]: RibbonButtonType } = {
    bold: {
        title: 'Bold',
        image: require('../svg/bold.svg'),
        onClick: toggleBold,
        checked: format => format.isBold,
    },
    italic: {
        title: 'Italic',
        image: require('../svg/italic.svg'),
        onClick: toggleItalic,
        checked: format => format.isItalic,
    },
    underline: {
        title: 'Underline',
        image: require('../svg/underline.svg'),
        onClick: toggleUnderline,
        checked: format => format.isUnderline,
    },
    fontName: {
        title: 'Font',
        image: require('../svg/fontname.svg'),
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
        image: require('../svg/fontsize.svg'),
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
        image: require('../svg/textcolor.svg'),
        onClick: (editor, color) =>
            setTextColor(editor, {
                lightModeColor: color,
                darkModeColor: getDarkColor(color),
            }),
        dropDownItems: {
            '#51a7f9': 'Light Blue',
            '#6fc040': 'Light Green',
            '#f5d427': 'Light Yellow',
            '#f3901d': 'Light Orange',
            '#ed5c57': 'Light Red',
            '#b36ae2': 'Light Purple',
            '#0c64c0': 'Blue',
            '#0c882a': 'Green',
            '#dcbe22': 'Yellow',
            '#de6a19': 'Orange',
            '#c82613': 'Red',
            '#763e9b': 'Purple',
            '#174e86': 'Dark Blue',
            '#0f5c1a': 'Dark Green',
            '#c3971d': 'Dark Yellow',
            '#be5b17': 'Dark Orange',
            '#861106': 'Dark Red',
            '#5e327c': 'Dark Purple',
            '#002451': 'Darker Blue',
            '#06400c': 'Darker Green',
            '#a37519': 'Darker Yellow',
            '#934511': 'Darker Orange',
            '#570606': 'Darker Red',
            '#3b204d': 'Darker Purple',
            '#ffffff': 'White',
            '#cccccc': 'Light Gray',
            '#999999': 'Gray',
            '#666666': 'Dark Gray',
            '#333333': 'Darker Gray',
            '#000000': 'Black',
        },
    },
    backColor: {
        title: 'Highlight',
        image: require('../svg/backcolor.svg'),
        onClick: (editor, color) =>
            setBackgroundColor(editor, {
                lightModeColor: color,
                darkModeColor: getDarkColor(color),
            }),
        dropDownItems: {
            '#00ffff': 'Cyan',
            '#00ff00': 'Green',
            '#ffff00': 'Yellow',
            '#ff8000': 'Orange',
            '#ff0000': 'Red',
            '#ff00ff': 'Magenta',
            '#80ffff': 'Light Cyan',
            '#80ff80': 'Light Green',
            '#ffff80': 'Light Yellow',
            '#ffc080': 'Light Orange',
            '#ff8080': 'Light Red',
            '#ff80ff': 'Light Magenta',
            '#ffffff': 'White',
            '#cccccc': 'Light Gray',
            '#999999': 'Gray',
            '#666666': 'Dark Gray',
            '#333333': 'Darker Gray',
            '#000000': 'Black',
        },
    },
    capitalization: {
        title: 'Change case',
        image: require('../svg/capitalization.svg'),
        onClick: changeCapitalization,
        dropDownItems: {
            sentence: 'Sentence case.',
            lowercase: 'lowercase',
            uppercase: 'UPPERCASE',
            capitalize: 'Capitalize Each Word',
        },
    },
    bullet: {
        title: 'Bullet',
        image: require('../svg/bullets.svg'),
        onClick: toggleBullet,
        checked: format => format.isBullet,
    },
    numbering: {
        title: 'Numbering',
        image: require('../svg/numbering.svg'),
        onClick: editor => toggleNumbering(editor),
        checked: format => format.isNumbering,
    },
    outdent: {
        title: 'Decrease indent',
        image: require('../svg/outdent.svg'),
        onClick: editor => setIndentation(editor, Indentation.Decrease),
    },
    indent: {
        title: 'Increase indent',
        image: require('../svg/indent.svg'),
        onClick: editor => setIndentation(editor, Indentation.Increase),
    },
    blockQuote: {
        title: 'Quote',
        image: require('../svg/blockquote.svg'),
        onClick: editor => toggleBlockQuote(editor),
        checked: format => format.isBlockQuote,
    },
    alignLeft: {
        title: 'Align left',
        image: require('../svg/alignleft.svg'),
        onClick: editor => setAlignment(editor, Alignment.Left),
    },
    alignCenter: {
        title: 'Align center',
        image: require('../svg/aligncenter.svg'),
        onClick: editor => setAlignment(editor, Alignment.Center),
    },
    alignRight: {
        title: 'Align right',
        image: require('../svg/alignright.svg'),
        onClick: editor => setAlignment(editor, Alignment.Right),
    },
    insertLink: {
        title: 'Insert hyperlink',
        image: require('../svg/createlink.svg'),
        onClick: null,
        dropDownItems: { '0': 'dummy' },
        dropDownRenderer: renderInsertLinkDialog,
        preserveOnClickAway: true,
    },
    unlink: {
        title: 'Remove hyperlink',
        image: require('../svg/unlink.svg'),
        onClick: removeLink,
    },
    table: {
        title: 'Show table options',
        image: require('../svg/table.svg'),
        onClick: null,
        dropDownItems: { 0: 'dummy' },
        dropDownRenderer: renderTableOptions,
        preserveOnClickAway: true,
    },
    insertImage: {
        title: 'Insert inline image',
        image: require('../svg/inlineimage.svg'),
        onClick: editor => {
            const document = editor.getDocument();
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
        image: require('../svg/superscript.svg'),
        onClick: toggleSuperscript,
        checked: format => format.isSuperscript,
    },
    subscript: {
        title: 'Subscript',
        image: require('../svg/subscript.svg'),
        onClick: toggleSubscript,
        checked: format => format.isSubscript,
    },
    strikethrough: {
        title: 'Strikethrough',
        image: require('../svg/strikethrough.svg'),
        onClick: toggleStrikethrough,
        checked: format => format.isStrikeThrough,
    },
    header: {
        title: 'Header',
        image: require('../svg/header.svg'),
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
        image: require('../svg/code.svg'),
        onClick: editor => toggleCodeBlock(editor),
    },
    ltr: {
        title: 'Left-to-right',
        image: require('../svg/ltr.svg'),
        onClick: editor => setDirection(editor, Direction.LeftToRight),
    },
    rtl: {
        title: 'Right-to-left',
        image: require('../svg/rtl.svg'),
        onClick: editor => setDirection(editor, Direction.RightToLeft),
    },
    undo: {
        title: 'Undo',
        image: require('../svg/undo.svg'),
        onClick: editor => editor.undo(),
    },
    redo: {
        title: 'Redo',
        image: require('../svg/redo.svg'),
        onClick: editor => editor.redo(),
    },
    clearFormat: {
        title: 'Remove formatting',
        image: require('../svg/removeformat.svg'),
        onClick: (editor, key) => {
            const handlers: Record<string, ClearFormatMode> = {
                autodetect: ClearFormatMode.AutoDetect,
                block: ClearFormatMode.Block,
                selection: ClearFormatMode.Inline,
            };
            clearFormat(editor, handlers[key]);
        },
        dropDownItems: {
            autodetect: 'Remove format (Autodetect)',
            selection: 'Remove formatting of selected text',
            block: 'Remove formatting of selected paragraphs',
        },
    },
    dark: {
        title: 'Dark Mode',
        image: require('../svg/moon.svg'),
        onClick: editor => {
            const isDark = !editor.isDarkMode();
            editor.setDarkModeState(isDark);
        },
        checked: (format, editor) => editor.isDarkMode(),
        isHidden: () => !MainPaneBase.getInstance().isDarkModeSupported(),
    },
    paste: {
        title: 'Paste Again',
        onClick: (editor, key) => {
            editor.focus();
            const data = getLastClipboardData(editor).data;

            if (data) {
                switch (key) {
                    case 'original':
                        editor.paste(data);
                        break;
                    case 'text':
                        editor.paste(data, true);
                        break;
                    case 'merge':
                        editor.paste(data, false, true);
                        break;
                }
            } else {
                alert('No clipboard data found');
            }
        },
        isDisabled: editor => !getLastClipboardData(editor).data,
        dropDownItems: {
            original: 'Paste Original',
            text: 'Paste Text',
            merge: 'Paste and Merge Format',
        },
    },
    export: {
        title: 'Export',
        onClick: editor => {
            let w = window.open();
            w.document.write(trustedHTMLHandler(editor.getContent()));
        },
    },
    clear: {
        title: 'Clear',
        onClick: editor => {
            editor.addUndoSnapshot(() => {
                editor.setContent('');
            });
        },
    },
    popout: {
        title: 'Popout',
        isDisabled: editor =>
            !(Browser.isChrome || Browser.isFirefox) || editor.getDocument().defaultView != window,
        onClick: () => {
            MainPaneBase.getInstance().popout();
        },
    },
};

export default buttons;
