// import execCommand from '../utils/execCommand';
// import setBackgroundColor from './setBackgroundColor';
// import setFontName from './setFontName';
// import setFontSize from './setFontSize';
// import setTextColor from './setTextColor';
// import toggleBold from './toggleBold';
// import toggleItalic from './toggleItalic';
// import toggleUnderline from './toggleUnderline';
import { ChangeSource, BlockElement, NodeType,
    // DocumentCommand, QueryScope
} from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { getTagOfNode, unwrap, isBlockElement, wrap } from 'roosterjs-editor-dom';

// const STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];

/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 */
export default function clearFormat(editor: Editor, clearBlockFormat?: boolean) {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        // if (clearBlockFormat) {
            let traverser = editor.getSelectionTraverser();
            let block = traverser && traverser.currentBlockElement;
            let blocks: BlockElement[] = [];
            while (block) {
                blocks.push(block);
                block = traverser.getNextBlockElement();
            }
            blocks.forEach(block => {
                let element = block.collapseToSingleElement();
                clearStyle(element);
            });
            editor.select(start, end);
        // }


        // execCommand(editor, DocumentCommand.RemoveFormat);

        // editor.queryElements('[class]', QueryScope.OnSelection, node =>
        //     node.removeAttribute('class')
        // );

        // const defaultFormat = editor.getDefaultFormat();
        // const isDefaultFormatEmpty = Object.keys(defaultFormat).length === 0;
        // editor.queryElements('[style]', QueryScope.InSelection, node => {
        //     STYLES_TO_REMOVE.forEach(style => node.style.removeProperty(style));

        //     // when default format is empty, keep the HTML minimum by removing style attribute if there's no style
        //     // (note: because default format is empty, we're not adding style back in)
        //     if (isDefaultFormatEmpty && node.getAttribute('style') === '') {
        //         node.removeAttribute('style');
        //     }
        // });

        // if (!isDefaultFormatEmpty) {
        //     if (defaultFormat.fontFamily) {
        //         setFontName(editor, defaultFormat.fontFamily);
        //     }
        //     if (defaultFormat.fontSize) {
        //         setFontSize(editor, defaultFormat.fontSize);
        //     }
        //     if (defaultFormat.textColor) {
        //         setTextColor(editor, defaultFormat.textColor);
        //     }
        //     if (defaultFormat.backgroundColor) {
        //         setBackgroundColor(editor, defaultFormat.backgroundColor);
        //     }
        //     if (defaultFormat.bold) {
        //         toggleBold(editor);
        //     }
        //     if (defaultFormat.italic) {
        //         toggleItalic(editor);
        //     }
        //     if (defaultFormat.underline) {
        //         toggleUnderline(editor);
        //     }
        // }
    }, ChangeSource.Format);
}

const TAGS_TO_UNWRAP = 'B,I,U,STRONG,EM,SUB,SUP,STRIKE,FONT,CENTER,A,H1,H2,H3,H4,H5,H6'.split(',');

function clearStyle(element: HTMLElement) {
    let nodesToUnwrap: HTMLElement[] = [];
    internalClearStyle(element, nodesToUnwrap);

    for (let i = nodesToUnwrap.length - 1; i >= 0; i--) {
        let nodeToUnwrap = nodesToUnwrap[i];
        if (isBlockElement(nodeToUnwrap)) {
            wrap(nodeToUnwrap);
        }
        unwrap(nodeToUnwrap);
    }
}

function internalClearStyle(element: HTMLElement, nodesToUnwrap: HTMLElement[]) {
    if (TAGS_TO_UNWRAP.indexOf(getTagOfNode(element)) >= 0) {
        nodesToUnwrap.push(element);
    } else {
        ([].slice.call(element.attributes) as Attr[]).forEach(attr => element.removeAttributeNode(attr));
    }

    for (let child: Node = element.firstChild; child; child = child.nextSibling) {
        if (child.nodeType == NodeType.Element) {
            clearStyle(child as HTMLElement);
        }
    }
}
