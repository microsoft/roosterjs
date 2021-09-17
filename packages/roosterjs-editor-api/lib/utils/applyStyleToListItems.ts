import { safeInstanceOf, setListItemStyle } from 'roosterjs-editor-dom';
/**
 * @internal
 * Checks if the parent element is a List Item, if it is, apply the style elements to the list item
 * @param parentNodes parentNodes to apply the style
 * @param styles styles to apply to the List Item Element
 */
export function applyStyleToListItems(parentNodes: Node[], styles: string[]) {
    parentNodes.forEach(node => {
        if (safeInstanceOf(node, 'HTMLLIElement')) {
            setListItemStyle(node, styles);
        }
    });
}
