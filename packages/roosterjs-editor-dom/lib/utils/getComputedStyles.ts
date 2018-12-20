import findClosestElementAncestor from './findClosestElementAncestor';

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
    let element = findClosestElementAncestor(node);
    let result: string[] = [];
    styleNames = styleNames instanceof Array ? styleNames : [styleNames];
    if (element) {
        let win = element.ownerDocument.defaultView || window;
        let styles = win.getComputedStyle(element);

        if (styles) {
            for (let style of styleNames) {
                let value = (styles.getPropertyValue(style) || '').toLowerCase();
                value = style == 'font-size' ? px2Pt(value) : value;
                result.push(value);
            }
        }
    }

    return result;
}

/**
 * A shortcut for getComputedStyles() when only one style is to be retrieved
 * @param node The node to get style from
 * @param styleName The style name
 * @returns The style value
 */
export function getComputedStyle(node: Node, styleName: string): string {
    return getComputedStyles(node, styleName)[0] || '';
}

function px2Pt(px: string) {
    if (px && px.indexOf('px') == px.length - 2) {
        // Edge may not handle the floating computing well which causes the calculated value is a little less than actual value
        // So add 0.05 to fix it
        return Math.round(parseFloat(px) * 75 + 0.05) / 100 + 'pt';
    }
    return px;
}
