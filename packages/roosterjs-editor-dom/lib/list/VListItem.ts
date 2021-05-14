import contains from '../utils/contains';
import getListTypeFromNode from './getListTypeFromNode';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import safeInstanceOf from '../utils/safeInstanceOf';
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
    private node: HTMLLIElement;
    private dummy: boolean;

    /**
     * Construct a new instance of VListItem class
     * @param node The DOM node for this item
     * @param listTypes An array represnets list types of all parent and current level.
     * Skip this parameter for a non-list item.
     */
    constructor(node: Node, ...listTypes: (ListType.Ordered | ListType.Unordered)[]) {
        if (!node) {
            throw new Error('node must not be null');
        }

        this.node = safeInstanceOf(node, 'HTMLLIElement')
            ? node
            : (wrap(node, '<li style="display:block"></li>') as HTMLLIElement);
        const display = this.node.style.display;

        this.dummy = display != 'list-item' && display != '';

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
     * Get the levels of this list item.
     */
    getLevel(): number {
        return this.listTypes.length - 1;
    }

    /**
     * Get DOM node of this list item
     */
    getNode(): HTMLLIElement {
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
     * Check if this item is a dummy item.
     * A dummy item is also represented by LI tag, but it won't render a bullet (for Unordered list) or a number (for Ordered list)
     * normally it has CSS style display set to a value other than "list-item"
     */
    isDummy() {
        return this.dummy;
    }

    /**
     * @deprecated Always return false
     */
    isOrphanItem(): boolean {
        return false;
    }

    /**
     * @deprecated
     */
    canMerge(item: VListItem): boolean {
        if (!item?.isOrphanItem() || this.listTypes.length != item.listTypes.length) {
            return false;
        }

        return this.listTypes.every((type, index) => item.listTypes[index] == type);
    }

    /**
     * @deprecated
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
     * Set whether the item is a dummy item
     * @param isDummy Whether the item is a dummy item
     */
    setIsDummy(isDummy: boolean) {
        this.dummy = isDummy;
    }

    /**
     * Write the change result back into DOM
     * @param listStack current stack of list elements
     * @param originalRoot Original list root element. It will be reused when write back if possible
     */
    writeBack(listStack: Node[], originalRoot?: HTMLOListElement | HTMLUListElement) {
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
            const newList = createListElement(
                listStack[0],
                this.listTypes[nextLevel],
                nextLevel,
                originalRoot
            );

            listStack[listStack.length - 1].appendChild(newList);
            listStack.push(newList);
        }

        // 3. Add current node into deepest list element
        listStack[listStack.length - 1].appendChild(this.node);
        this.node.style.display = this.dummy ? 'block' : null;

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

function createListElement(
    newRoot: Node,
    listType: ListType,
    nextLevel: number,
    originalRoot?: HTMLOListElement | HTMLUListElement
): HTMLOListElement | HTMLUListElement {
    const doc = newRoot.ownerDocument;
    let result: HTMLOListElement | HTMLUListElement;

    // Try to reuse the existing root element
    // It can be reused when
    // 1. Current list item is level 1 (top level), AND
    // 2. Original root exists, AND
    // 3. They have the same list type AND
    // 4. The original root is not used yet
    if (nextLevel == 1 && originalRoot && listType == getListTypeFromNode(originalRoot)) {
        if (contains(newRoot, originalRoot)) {
            // If it is already used, let's clone one and remove ID to avoid duplicating ID
            result = originalRoot.cloneNode(false /*deep*/) as HTMLOListElement | HTMLUListElement;
            (<HTMLOListElement>result).removeAttribute('id');
        } else {
            // Remove all child nodes, they will be added back later when write back other items
            while (originalRoot.firstChild) {
                originalRoot.removeChild(originalRoot.firstChild);
            }
            result = originalRoot;
        }
    } else {
        // Can't be reused, can't clone, let's create a new one
        result = doc.createElement(listType == ListType.Ordered ? 'ol' : 'ul');
    }

    if (listType == ListType.Ordered && nextLevel > 1) {
        result.style.listStyleType = orderListStyles[(nextLevel - 1) % orderListStyles.length];
    }

    return result;
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
