import contains from '../utils/contains';
import getListTypeFromNode from './getListTypeFromNode';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import toArray from '../utils/toArray';
import unwrap from '../utils/unwrap';
import wrap from '../utils/wrap';
import { ListType } from 'roosterjs-editor-types';

const orderListStyles = [null, 'lower-alpha', 'lower-roman'];

/**
 * @internal
 * !!! Never directly create instance of this class. It should be created within VList class !!!
 *
 * Represent a list item.
 *
 * A list item is normally wrapped using a LI tag. But this class is only a logical item,
 * it can be a LI tag, or another other type of node which means it is actually not a list item.
 * That can happen after we do "outdent" on a 1-level list item, then it becomes not a list item.
 * @internal
 */
export default class VListItem {
    private listTypes: ListType[];

    /**
     * Construct a new instance of VListItem class
     * @param node The DOM node for this item
     * @param listTypes An array represnets list types of all parent and current level.
     * Skip this parameter for a non-list item.
     */
    constructor(private node: Node, ...listTypes: (ListType.Ordered | ListType.Unordered)[]) {
        if (!node) {
            throw new Error('node must not be null');
        }

        // Always add a None list type in front of all other types to represent non-list scenario.
        this.listTypes = [ListType.None, ...listTypes];
    }

    /**
     * Get type of current list item
     */
    getListType(): ListType {
        return this.listTypes[this.listTypes.length - 1];
    }

    /**
     * Get DOM node of this list item
     */
    getNode(): Node {
        return this.node;
    }

    /**
     * Check if a given node is contained by this list item
     * @param node The node to check
     */
    contains(node: Node): boolean {
        return contains(this.node, node, true /*treateSameNodeAsContain*/);
    }

    /**
     * Check if this item is an orphan item.
     *
     * Orphan item is not a normal case but could happen. It represents the DOM nodes directly under OL/UL tag
     * and are in front of all other LI tags so that they cannot be merged into any existing LI tags.
     *
     * For example:
     * ```html
     * <ol>
     *   <div>Orphan node</div>
     *   <li>first item</li>
     * </ol>
     * ```
     * Here the first DIV tag is an orphan item.
     *
     * There can also be nodes directly under OL/UL but between other LI tags in source HTML which should not be
     * treated as orphan item because they can be merged into their previous LI tag. But when we build VList,
     * those nodes will be merged into LI, so that ideally here they should not exist.
     */
    isOrphanItem(): boolean {
        return getTagOfNode(this.node) != 'LI';
    }

    /**
     * Check if the given item can be merged into this item.
     * An item can be merged when it is an orphan item and its list type stack is exactly the same with current one.
     * @param item The item to check
     */
    canMerge(item: VListItem): boolean {
        if (!item?.isOrphanItem() || this.listTypes.length != item.listTypes.length) {
            return false;
        }

        return this.listTypes.every((type, index) => item.listTypes[index] == type);
    }

    /**
     * Merge items into this item.
     * @example Before merge:
     * ```html
     * <ol>
     *   <li>Current item</li>
     *   <div>line 1</div>
     *   <div>line 2</div>
     * </ol>
     * ```
     * After merge then two DIVs into LI:
     * ```html
     * <ol>
     *   <li>Current item
     *     <div>line 1</div>
     *     <div>line 2</div>
     *   </li>
     * </ol>
     * ```
     * @param items The items to merge
     */
    mergeItems(items: VListItem[]) {
        const nodesToWrap = items?.map(item => item.node) || [];
        const targetNodes = wrapIfNotBlockNode(
            nodesToWrap,
            true /*checkFirst*/,
            false /*checkLast*/
        );
        targetNodes.forEach(node => this.node.appendChild(node));
    }

    /**
     * Indent this item
     * If this is not an list item, it will be no op
     */
    indent() {
        const listType = this.getListType();
        if (listType != ListType.None) {
            this.listTypes.push(listType);
        }
    }

    /**
     * Outdent this item
     * If this item is already not an list item, it will be no op
     */
    outdent() {
        if (this.listTypes.length > 1) {
            this.listTypes.pop();
        }
    }

    /**
     * Change list type of this item
     * @param targetType The target list type to change to
     */
    changeListType(targetType: ListType) {
        if (targetType == ListType.None) {
            this.listTypes = [targetType];
        } else {
            this.outdent();
            this.listTypes.push(targetType);
        }
    }

    /**
     * Write the change result back into DOM
     * @param listStack current stack of list elements
     */
    writeBack(listStack: Node[]) {
        const doc = this.node.ownerDocument;
        let nextLevel = 1;

        // 1. Determine list elements that we can reuse
        // e.g.:
        //    passed in listStack: Fragment > OL > UL > OL
        //    local listTypes:     null     > OL > UL > UL > OL
        //    then Fragment > OL > UL can be reused
        for (; nextLevel < listStack.length; nextLevel++) {
            if (getListTypeFromNode(listStack[nextLevel]) !== this.listTypes[nextLevel]) {
                listStack.splice(nextLevel);
                break;
            }
        }

        // 2. Add new list elements
        // e.g.:
        //    passed in listStack: Fragment > OL > UL
        //    local listTypes:     null     > OL > UL > UL > OL
        //    then we need to create a UL and a OL tag
        for (; nextLevel < this.listTypes.length; nextLevel++) {
            const listType = this.listTypes[nextLevel];
            const newList = doc.createElement(listType == ListType.Ordered ? 'ol' : 'ul');

            if (listType == ListType.Ordered) {
                newList.style.listStyleType =
                    orderListStyles[(nextLevel - 1) % orderListStyles.length];
            }

            listStack[listStack.length - 1].appendChild(newList);
            listStack.push(newList);
        }

        // 3. Add current node into deepest list element
        listStack[listStack.length - 1].appendChild(this.node);

        // 4. If this is not a list item now, need to unwrap the LI node and do proper handling
        if (this.listTypes.length <= 1) {
            wrapIfNotBlockNode(
                getTagOfNode(this.node) == 'LI' ? getChildrenAndUnwrap(this.node) : [this.node],
                true /*checkFirst*/,
                true /*checkLast*/
            );
        }
    }
}

function wrapIfNotBlockNode(nodes: Node[], checkFirst: boolean, checkLast: boolean): Node[] {
    if (
        nodes.length > 0 &&
        (!checkFirst || !isBlockElement(nodes[0])) &&
        (!checkLast || !isBlockElement(nodes[nodes.length]))
    ) {
        nodes = [wrap(nodes)];
    }

    return nodes;
}

function getChildrenAndUnwrap(node: Node): Node[] {
    const result = toArray(node.childNodes);
    unwrap(node);
    return result;
}
