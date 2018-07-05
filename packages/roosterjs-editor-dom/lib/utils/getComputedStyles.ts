import Position from '../selection/Position';
import getElementOrParentElement from './getElementOrParentElement';

/**
 * Get computed styles of a node
 * @param node The node to get computed styles from
 * @param styleNames Names of style to get, can be a single name or an array.
 * Default value is font-family, font-size, color, background-color
 * @returns An array of the computed styles
 */
export default function getComputedStyles(
    node: Node,
    styleNames?: string | string[]
): string[];

/**
 * Get computed styles of start node of a range
 * @param range The range to get computed styles from
 * @param styleNames Names of style to get, can be a single name or an array.
 * Default value is font-family, font-size, color, background-color
 * @returns An array of the computed styles
 */
export default function getComputedStyles(
    range: Range,
    styleNames?: string | string[]
): string[];

export default function getComputedStyles(
    from: Node | Range,
    styleNames: string | string[] = ['font-family', 'font-size', 'color', 'background-color']
): string[] {
    let node = from instanceof Range ?
        Position.getStart(from).normalize().node :
        from;
    let element = getElementOrParentElement(node);
    let result: string[] = [];
    styleNames = styleNames instanceof Array ? styleNames : [styleNames];
    if (element) {
        let win = element.ownerDocument.defaultView || window;
        let styles = win.getComputedStyle(element);

        for (let style of styleNames) {
            let value = ((styles && styles.getPropertyValue(style)) || '').toLowerCase();
            value = style == 'font-size' ? px2Pt(value) : value;
            result.push(value);
        }
    }

    return result;
}

export function getComputedStyle(node: Node, styleName: string): string {
    return getComputedStyles(node, styleName)[0] || '';
}

function px2Pt(px: string) {
    if (px && px.indexOf('px') == px.length - 2) {
        return (Math.round(parseFloat(px) * 75) / 100) + 'pt';
    }
    return px;
}