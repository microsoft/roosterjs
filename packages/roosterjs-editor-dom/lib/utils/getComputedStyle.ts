import { NodeType } from 'roosterjs-editor-types';

export default function getComputedStyle(
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
