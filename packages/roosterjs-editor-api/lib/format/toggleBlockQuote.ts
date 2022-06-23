import blockWrap from '../utils/blockWrap';
import { IEditor, QueryScope } from 'roosterjs-editor-types';
import { unwrap, wrap } from 'roosterjs-editor-dom';

const BLOCKQUOTE_TAG = 'blockquote';
const DEFAULT_STYLER = (element: HTMLElement): void => {
    element.style.borderLeft = '3px solid';
    element.style.borderColor = '#C8C8C8';
    element.style.paddingLeft = '10px';
    element.style.color = '#666666';
};

/**
 * Toggle blockquote at selection, if selection already contains any blockquote elements,
 * the blockquote elements will be unquote and other elements will take no effect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the blockquote element
 */
export default function toggleBlockQuote(editor: IEditor, styler?: (element: HTMLElement) => void) {
    blockWrap(
        editor,
        nodes => {
            const wrapper = wrap(nodes, BLOCKQUOTE_TAG);
            (styler || DEFAULT_STYLER)(wrapper);
        },
        () => editor.queryElements('blockquote', QueryScope.OnSelection, unwrap).length == 0,
        'toggleBlockQuote'
    );
}
