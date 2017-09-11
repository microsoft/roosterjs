import { NodeType } from 'roosterjs-types';

export default function getComputedStyle(node: Node, styleName: string): string {
    let styleValue = '';
    if (node && node.nodeType == NodeType.Element) {
        let win = node.ownerDocument.defaultView || window;
        let styles = win.getComputedStyle(node as Element);
        styleValue = styles && styles.getPropertyValue(styleName);
        if (styleValue) {
            styleValue = styleValue.toLowerCase();
        }
    }

    return styleValue;
}
