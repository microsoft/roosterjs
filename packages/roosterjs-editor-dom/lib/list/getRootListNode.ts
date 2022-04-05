import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import { RegionBase } from 'roosterjs-editor-types';

/**
 * @internal
 * A type map from selector string to HTML element type
 */
export interface SelectorToTypeMap {
    ol: HTMLOListElement;
    ul: HTMLUListElement;
    'ol,ul': HTMLOListElement | HTMLUListElement;
}

/**
 * @internal
 * Get Root list node from the given node within the given region
 * @param region Region to scope the search into
 * @param selector The selector to search
 * @param node The start node
 */
export default function getRootListNode<TSelector extends keyof SelectorToTypeMap>(
    region: RegionBase,
    selector: TSelector,
    node: Node | null
): SelectorToTypeMap[TSelector] {
    let list =
        region &&
        (findClosestElementAncestor(
            node,
            region.rootNode,
            selector
        ) as SelectorToTypeMap[TSelector]);

    if (list) {
        let ancestor: SelectorToTypeMap[TSelector];
        while (
            (ancestor = findClosestElementAncestor(
                list.parentNode,
                region.rootNode,
                selector
            ) as SelectorToTypeMap[TSelector])
        ) {
            list = ancestor;
        }
    }

    return list;
}
