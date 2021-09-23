import applyInlineStyle from '../utils/applyInlineStyle';
import { applyStyleToListItems } from '../utils/applyStyleToListItems';
import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 * Set the List Item Style when all inner inline element have the same style
 * @param editor The editor instance
 * @param styleName Name of the style to apply to the list item
 * @param formatCallback callback to apply the style to each element
 */
export default function applyListItemStyleWrap(
    editor: IEditor,
    styleName: string,
    formatCallback: (element: HTMLElement, isInnerNode?: boolean) => any
) {
    const parentNodes: Node[] = [];
    applyInlineStyle(editor, (element, isInnerNode) => {
        formatCallback(element, isInnerNode);

        let parent = editor.getElementAtCursor('LI', element);
        if (parent && parentNodes.indexOf(parent) === -1) {
            parentNodes.push(parent);
        }
    });

    applyStyleToListItems(parentNodes, [styleName]);
}
