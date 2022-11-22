import applyInlineStyle from '../utils/applyInlineStyle';
import { IEditor } from 'roosterjs-editor-types';
import { safeInstanceOf, setListItemStyle } from 'roosterjs-editor-dom';

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
    formatCallback: (element: HTMLElement, isInnerNode?: boolean) => any,
    apiName: string
) {
    const parentNodes: Node[] = [];
    applyInlineStyle(
        editor,
        (element, isInnerNode) => {
            formatCallback(element, isInnerNode);

            let parent = editor.getElementAtCursor('LI', element);
            if (parent && parentNodes.indexOf(parent) === -1) {
                parentNodes.push(parent);
            }
        },
        apiName
    );

    applyStyleToListItems(parentNodes, [styleName]);
}

/**
 * @internal
 * Checks if the parent element is a List Item, if it is, apply the style elements to the list item
 * @param parentNodes parentNodes to apply the style
 * @param styles styles to apply to the List Item Element
 */
function applyStyleToListItems(parentNodes: Node[], styles: string[]) {
    parentNodes.forEach(node => {
        if (safeInstanceOf(node, 'HTMLLIElement')) {
            setListItemStyle(node, styles);
        }
    });
}
