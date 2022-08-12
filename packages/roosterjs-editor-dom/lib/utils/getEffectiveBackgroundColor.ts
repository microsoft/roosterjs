import findClosestElementAncestor from './findClosestElementAncestor';
import getComputedStyles from './getComputedStyles';

/**
 * Get effective background value based on parent nodes
 * @param node The node to get computed styles from
 * @param rootNode Top most ancestor node to stop searching for inherited background value
 * @returns An array of the computed styles
 */
export default function getEffectiveBackgroundColor(node: Node, rootNode: Node): string {
    const value = getComputedStyles(node, 'background-color')[0];
    if (value === 'rgba(0, 0, 0, 0)') {
        const parentNode = findClosestElementAncestor(node.parentNode, rootNode);
        if (parentNode) {
            return getEffectiveBackgroundColor(parentNode, rootNode);
        }
    }
    return value;
}
