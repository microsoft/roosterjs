import changeElementTag from '../utils/changeElementTag';
import getListTypeFromNode, { isListElement } from './getListTypeFromNode';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import isNodeEmpty from '../utils/isNodeEmpty';
import Position from '../selection/Position';
import queryElements from '../utils/queryElements';
import splitParentNode from '../utils/splitParentNode';
import toArray from '../utils/toArray';
import unwrap from '../utils/unwrap';
import VListItem from './VListItem';
import wrap from '../utils/wrap';
import {
    Indentation,
    ListType,
    NodePosition,
    PositionType,
    NodeType,
} from 'roosterjs-editor-types';

/**
 * Represent a bullet or a numbering list
 *
 * @example
 * A VList is a logical representation of list items, it contains an item array with node and list type stack.
 * e.g. We have a list like this
 * ```html
 * <ol>
 *   <li>item 1</li>
 *   <li>item 2</li>
 *   <ul>
 *     <li>item 2.1</li>
 *     <li>item 2.2</li>
 *   <ul>
 * </ol>
 * ```
 *
 * A VList of this list will be like this:
 * ```javascript
 * {
 *   rootList: (OL node),
 *   items: [{
 *       node: (LI node with 'item 1'),
 *       listTypes: [null, OL],
 *     }, {
 *       node: (LI node with 'item 2'),
 *       listTypes: [null, OL],
 *     }, {
 *       node: (LI node with 'item 2.1),
 *       listTypes: [null, OL, UL],
 *     }, {
 *       node: (LI node with 'item 2.2'),
 *       listTypes: [null, OL, UL],
 *     }
 *   ]
 * }
 * ```
 *
 * When we want to outdent item 2.1, we just need to remove the last "UL" from listTypes of item 2.1, then
 * the writeBack() function will handle everything related to DOM change
 */
export default class VList {
    private items: VListItem[] = [];

    /**
     * Create a new instance of VList class
     * @param rootList The root list element, can be either OL or UL tag
     */
    constructor(private rootList: HTMLOListElement | HTMLUListElement) {
        if (!rootList) {
            throw new Error('rootList must not be null');
        }

        // Before populate items, we need to normalize the list to make sure it is in a correct format
        // otherwise further action may mass thing up.
        //
        // There are two kinds of normalization to perform.
        // 1. Move nodes directly under OL/UL into a LI node, unless it is an orphan node
        // Please see comment for VListItem.isOrphanItem() for more information about orphan node
        // e.g.:
        // ```HTML
        // <ol>
        //   <li>item 1</li>
        //   <div>item 2</div>
        // </ol>
        // ```
        // After this step, it should become:
        // ```html
        // <ol>
        //   <li>item 1
        //     <div>item 2</div>
        //   <li>
        // </ol>
        // ```
        moveChildNodesToLi(this.rootList);
        queryElements(this.rootList, 'ol,ul', moveChildNodesToLi);

        // 2. Move LI node embeded into another LI node out to directly under OL/UL node
        // Ideally browser we do this for us automatically when out the HTML into DOM. However after
        // step 1, it is possible that we move some LI node into another one. e.g:
        // ```HTML
        // <ol>
        //   <li>item 1</li>
        //   <div>
        //     item 1.1
        //     <li>item 3</li>
        //   </div>
        // </ol>
        // ```
        // See that the second LI tag is not directly under OL, so after step 1, this will become:
        // ```html
        // <ol>
        //   <li>item 1
        //     <div>
        //       item 1.1
        //       <li>item 2</li>
        //     </div>
        //   <li>
        // </ol>
        // ```
        // Now we have a LI tag embeded into another LI tag. So we need step 2 to move the inner LI tag out to be:
        // ```html
        // <ol>
        //   <li>item1
        //     <div>item 1.1</div>
        //   </li>
        //   <li><div>item2</div></li>
        // </ol>
        // ```
        queryElements(this.rootList, 'li', moveLiToList);

        this.populateItems(this.rootList);
    }

    /**
     * Check if this list contains the given node
     * @param node The node to check
     */
    contains(node: Node) {
        // We don't check if the node is contained by this.rootList here, because after some operation,
        // it is possible a node is logically contained by this list but the container list item hasn't
        // been put under this.rootList in DOM tree yet.
        return this.items.some(item => item.contains(node));
    }

    /**
     * Get the first or last node of this list
     * @param isLast true to get last node, false to get first node
     */
    getFirstOrLastNode(isLast: boolean): Node {
        const item = this.items[isLast ? this.items.length - 1 : 0];
        return item?.getNode();
    }

    /**
     * Write the result back into DOM tree
     * After that, this VList becomes unavailable because we set this.rootList to null
     */
    writeBack() {
        if (!this.rootList) {
            throw new Error('rootList must not be null');
        }

        const listStack: Node[] = [this.rootList.ownerDocument.createDocumentFragment()];

        this.items.forEach(item => item.writeBack(listStack));
        this.rootList.parentNode.replaceChild(listStack[0], this.rootList);

        // Set rootList to null to avoid this to be called again for the same VList, because
        // after change the rootList may not be available any more (e.g. outdent all items).
        this.rootList = null;
    }

    /**
     * Set indentation of the given range of this list
     * @param start Start position to operate from
     * @param end End positon to operate to
     * @param indentation Indent or outdent
     */
    setIndentation(start: NodePosition, end: NodePosition, indentation: Indentation) {
        this.findListItems(start, end, item =>
            indentation == Indentation.Decrease ? item.outdent() : item.indent()
        );
    }

    /**
     * Change list type of the given range of this list.
     * If some of the items are not real list item yet, this will make them to be list item with given type
     * If all items in the given range are already in the type to change to, this becomes an outdent operation
     * @param start Start position to operate from
     * @param end End position to operate to
     * @param targetType Target list type
     */
    changeListType(start: NodePosition, end: NodePosition, targetType: ListType) {
        let needChangeType = false;

        this.findListItems(start, end, item => {
            needChangeType = needChangeType || item.getListType() != targetType;
        });
        this.findListItems(start, end, item =>
            needChangeType ? item.changeListType(targetType) : item.outdent()
        );
    }

    /**
     * Append a new item to this VList
     * @param node node of the item to append. If it is not wrapped with LI tag, it will be wrapped
     * @param type Type of this list item, can be ListType.None
     */
    appendItem(node: Node, type: ListType) {
        let newListNode = node;
        const nodeTag = getTagOfNode(node);

        if (nodeTag != 'LI' && nodeTag != 'TABLE') {
            newListNode = changeElementTag(<HTMLElement>node, 'LI');
        } else if (nodeTag == 'TABLE') {
            newListNode = wrap(node, 'li');
        }

        this.items.push(
            type == ListType.None ? new VListItem(newListNode) : new VListItem(newListNode, type)
        );
    }

    /**
     * Merge the given VList into current VList.
     * - All list items will be removed from the given VList and added into this list.
     * - The root node of the given VList will be removed from DOM tree
     * - If there are orphan items in the given VList, they will be merged into the last item
     *   of this list if any.
     * @param list The vList to merge from
     */
    mergeVList(list: VList) {
        if (list && list != this) {
            const originalLength = this.items.length;
            list.items.forEach(item => this.items.push(item));
            list.items.splice(0, list.items.length);

            this.mergeOrphanNodesAfter(originalLength - 1);
            list.rootList.parentNode?.removeChild(list.rootList);
        }
    }

    private mergeOrphanNodesAfter(startIndex: number) {
        const item = this.items[startIndex];

        if (item && !item.isOrphanItem()) {
            for (let i = startIndex + 1; i <= this.items.length; i++) {
                if (!item || !item.canMerge(this.items[i])) {
                    item.mergeItems(this.items.splice(startIndex + 1, i - startIndex - 1));
                    break;
                }
            }
        }
    }

    private findListItems(
        start: NodePosition,
        end: NodePosition,
        callback?: (item: VListItem) => any
    ): VListItem[] {
        if (this.items.length == 0) {
            return [];
        }

        const listStartPos = new Position(this.items[0].getNode(), PositionType.Begin);
        const listEndPos = new Position(
            this.items[this.items.length - 1].getNode(),
            PositionType.End
        );

        let startIndex = listStartPos.isAfter(start) ? 0 : -1;
        let endIndex = this.items.length - (end.isAfter(listEndPos) ? 1 : 0);

        this.items.forEach((item, index) => {
            startIndex = item.contains(start.node) ? index : startIndex;
            endIndex = item.contains(end.node) ? index : endIndex;
        });

        startIndex = endIndex < this.items.length ? Math.max(0, startIndex) : startIndex;
        endIndex = startIndex >= 0 ? Math.min(this.items.length - 1, endIndex) : endIndex;

        const result = startIndex <= endIndex ? this.items.slice(startIndex, endIndex + 1) : [];

        if (callback) {
            result.forEach(callback);
            this.mergeOrphanNodesAfter(endIndex);
        }

        return result;
    }

    private populateItems(
        list: HTMLOListElement | HTMLUListElement,
        listTypes: (ListType.Ordered | ListType.Unordered)[] = []
    ) {
        const type = getListTypeFromNode(list);

        for (let item = list.firstChild; !!item; item = item.nextSibling) {
            const newListTypes = [...listTypes, type];

            if (isListElement(item)) {
                this.populateItems(item as HTMLOListElement | HTMLUListElement, newListTypes);
            } else if (item.nodeType != NodeType.Text || item.nodeValue.trim() != '') {
                this.items.push(new VListItem(item, ...newListTypes));
            }
        }
    }
}

//Normalization

// Step 1: Move all non-LI direct children under list into LI
// e.g.
// From: <ul><li>line 1</li>line 2</ul>
// To:   <ul><li>line 1<div>line 2</div></li></ul>
function moveChildNodesToLi(list: HTMLOListElement | HTMLUListElement) {
    let currentItem: HTMLLIElement = null;

    toArray(list.childNodes).forEach(child => {
        if (getTagOfNode(child) == 'LI') {
            currentItem = child as HTMLLIElement;
        } else if (isListElement(child)) {
            currentItem = null;
        } else if (currentItem && !isNodeEmpty(child, true /*trimContent*/)) {
            currentItem.appendChild(isBlockElement(child) ? child : wrap(child));
        }
    });
}

// Step 2: Move nested LI up to under list directly
// e.g.
// From: <ul><li>line 1<li>line 2</li>line 3</li></ul>
// To:   <ul><li>line 1</li><li>line 2<div>line 3</div></li></ul>
function moveLiToList(li: HTMLLIElement) {
    while (!isListElement(li.parentNode)) {
        splitParentNode(li, true /*splitBefore*/);
        let furtherNodes: Node[] = toArray(li.parentNode.childNodes).slice(1);

        if (furtherNodes.length > 0) {
            if (!isBlockElement(furtherNodes[0])) {
                furtherNodes = [wrap(furtherNodes)];
            }
            furtherNodes.forEach(node => li.appendChild(node));
        }

        unwrap(li.parentNode);
    }
}
