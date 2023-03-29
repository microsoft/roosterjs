import blockWrap from '../utils/blockWrap';
import { IEditor, QueryScope } from 'roosterjs-editor-types';
import { unwrap, wrap } from 'roosterjs-editor-dom';

const PRE_TAG = 'pre';
const CODE_TAG = 'code';
const SELECTOR = `${PRE_TAG}>${CODE_TAG}`;

/**
 * Toggle code block at selection, if selection already contains any code blocked elements,
 * the code block elements will be no longer be code blocked and other elements will take no affect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the code block element
 */
export default function toggleCodeBlock(
    editor: IEditor,
    styler?: (element: HTMLElement) => void
): void {
    blockWrap(
        editor,
        nodes => {
            const code = wrap(nodes, CODE_TAG);
            const pre = wrap(code, PRE_TAG);
            styler?.(pre);
        },
        () =>
            editor.queryElements(SELECTOR, QueryScope.OnSelection, code => {
                if (!code.previousSibling && !code.nextSibling) {
                    const parent = code.parentNode;
                    unwrap(code);
                    if (parent) {
                        unwrap(parent);
                    }
                }
            }).length == 0,
        'toggleCodeBlock'
    );
}
