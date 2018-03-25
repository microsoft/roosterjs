import { NodeType } from 'roosterjs-editor-types';

/**
 * Get computed styles of a node
 * @param node The node to get computed styles from
 * @param styleNames Names of style to get, can be a single name or an array.
 * Default value is font-family, font-size, color, background-color
 * @returns An array of the computed styles
 */
export default function getComputedStyles(
    node: Node,
    styleNames: string | string[] = ['font-family', 'font-size', 'color', 'background-color']
): string[] {
    let result: string[] = [];
    styleNames = styleNames instanceof Array ? styleNames : [styleNames];
    if (node && node.nodeType == NodeType.Element) {
        let win = node.ownerDocument.defaultView || window;
        let styles = win.getComputedStyle(node as Element);

        for (let style of styleNames) {
            result.push(((styles && styles.getPropertyValue(style)) || '').toLowerCase());
        }
    }

    return result;
}
