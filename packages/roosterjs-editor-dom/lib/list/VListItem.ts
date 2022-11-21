import contains from '../utils/contains';
import getListTypeFromNode from './getListTypeFromNode';
import getStyles from '../style/getStyles';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import moveChildNodes from '../utils/moveChildNodes';
import safeInstanceOf from '../utils/safeInstanceOf';
import setBulletListMarkers from './setBulletListMarkers';
import setListItemStyle from './setListItemStyle';
import setNumberingListMarkers from './setNumberingListMarkers';
import setStyles from '../style/setStyles';
import toArray from '../jsUtils/toArray';
import unwrap from '../utils/unwrap';
import wrap from '../utils/wrap';
import { createNumberDefinition, createObjectDefinition } from '../metadata/definitionCreators';
import { getMetadata, setMetadata } from '../metadata/metadata';
import {
    BulletListType,
    KnownCreateElementDataIndex,
    ListType,
    NumberingListType,
} from 'roosterjs-editor-types';
import type {
    CompatibleBulletListType,
    CompatibleListType,
    CompatibleNumberingListType,
} from 'roosterjs-editor-types/lib/compatibleTypes';

const orderListStyles = [null, 'lower-alpha', 'lower-roman'];
const unorderedListStyles = ['disc', 'circle', 'square'];

const MARGIN_BASE = '0in 0in 0in 0.5in';
const NEGATIVE_MARGIN = '-.25in';

const stylesToInherit = ['font-size', 'font-family', 'color'];
const attrsToInherit = ['data-ogsc', 'data-ogsb', 'data-ogac', 'data-ogab'];

/**
 * @internal
 * The definition for the number of BulletListType or NumberingListType
 */
export const ListStyleDefinitionMetadata = createObjectDefinition<ListStyleMetadata>(
    {
        orderedStyleType: createNumberDefinition(
            true /** isOptional */,
            undefined /** value **/,
            NumberingListType.Min,
            NumberingListType.Max
        ),
        unorderedStyleType: createNumberDefinition(
            true /** isOptional */,
            undefined /** value **/,
            BulletListType.Min,
            BulletListType.Max
        ),
    },
    true /** isOptional */,
    true /** allowNull */
);

/**
 * @internal
 * Represents the metadata of the style of a list element
 */
export interface ListStyleMetadata {
    orderedStyleType?: NumberingListType | CompatibleNumberingListType;
    unorderedStyleType?: BulletListType | CompatibleBulletListType;
}

/**
 * !!! Never directly create instance of this class. It should be created within VList class !!!
 *
 * Represent a list item.
 *
 * A list item is normally wrapped using a LI tag. But this class is only a logical item,
 * it can be a LI tag, or another other type of node which means it is actually not a list item.
 * That can happen after we do "outdent" on a 1-level list item, then it becomes not a list item.
 */
export default class VListItem {
    private listTypes: (ListType | CompatibleListType)[];
    private node: HTMLLIElement;
    private dummy: boolean;
    private newListStart: number | undefined = undefined;

    /**
     * Construct a new instance of VListItem class
     * @param node The DOM node for this item
     * @param listTypes An array represents list types of all parent and current level.
     * Skip this parameter for a non-list item.
     */
    constructor(
        node: Node,
        ...listTypes: (
            | ListType.Ordered
            | ListType.Unordered
            | CompatibleListType.Ordered
            | CompatibleListType.Unordered
        )[]
    ) {
        if (!node) {
            throw new Error('node must not be null');
        }

        this.node = safeInstanceOf(node, 'HTMLLIElement')
            ? node
            : (wrap(node, KnownCreateElementDataIndex.BlockListItem) as HTMLLIElement);
        const display = this.node.style.display;

        this.dummy = display != 'list-item' && display != '';

        // Always add a None list type in front of all other types to represent non-list scenario.
        this.listTypes = [ListType.None, ...listTypes];
    }

    /**
     * Get type of current list item
     */
    getListType(): ListType | CompatibleListType {
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
     * Get the Start Number of the new List
     */
    getNewListStart(): number | undefined {
        return this.newListStart;
    }

    /**
     * Check if a given node is contained by this list item
     * @param node The node to check
     */
    contains(node: Node): boolean {
        return contains(this.node, node, true /*treatSameNodeAsContain*/);
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
        if (this.node.style.marginLeft == NEGATIVE_MARGIN) {
            this.node.style.margin = '';
            this.node.style.marginLeft = '';
            return;
        }

        const listType = this.getListType();
        if (listType != ListType.None) {
            this.listTypes.push(listType);
        }
    }

    /**
     * Outdent this item
     * If this item is already not an list item, it will be no op
     * @param preventItemRemoval Whether prevent the list item to be removed for the listItem by default false
     */
    outdent(preventItemRemoval: boolean = false) {
        const expectedLength = preventItemRemoval ? 2 : 1;
        if (this.listTypes.length > expectedLength) {
            this.listTypes.pop();
        }
    }

    /**
     * Add negative margin to the List item
     */
    addNegativeMargins() {
        this.node.style.margin = MARGIN_BASE;
        this.node.style.marginLeft = NEGATIVE_MARGIN;
    }

    /**
     * Change list type of this item
     * @param targetType The target list type to change to
     */
    changeListType(targetType: ListType | CompatibleListType) {
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
     * Set the start Number of the new list
     * @param isDummy Whether the item is a dummy item
     */
    setNewListStart(startNumber: number) {
        this.newListStart = startNumber;
    }

    /**
     * Apply the list style type
     * @param rootList the vList that receives the style
     * @param index the list item index
     */
    applyListStyle(rootList: HTMLOListElement | HTMLUListElement, index: number) {
        const style = getMetadata<ListStyleMetadata>(rootList, ListStyleDefinitionMetadata);
        // The list just need to be styled if it is at top level, so the listType length for this Vlist must be 2.
        const isFirstLevel = this.listTypes.length < 3;
        if (style) {
            if (
                isFirstLevel &&
                this.listTypes[1] === ListType.Unordered &&
                style.unorderedStyleType
            ) {
                setBulletListMarkers(this.node, style.unorderedStyleType);
            } else if (
                isFirstLevel &&
                this.listTypes[1] === ListType.Ordered &&
                style.orderedStyleType
            ) {
                setNumberingListMarkers(this.node, style.orderedStyleType, index);
            } else {
                this.node.style.removeProperty('list-style-type');
            }
        }
    }

    /**
     * Write the change result back into DOM
     * @param listStack current stack of list elements
     * @param originalRoot Original list root element. It will be reused when write back if possible
     * @param shouldReuseAllAncestorListElements Optional - defaults to false. If true, only make
     *              sure the direct parent of this list matches the list types when writing back.
     */
    writeBack(
        listStack: Node[],
        originalRoot?: HTMLOListElement | HTMLUListElement,
        shouldReuseAllAncestorListElements: boolean = false
    ) {
        let nextLevel = 1;

        if (shouldReuseAllAncestorListElements) {
            // Remove any un-needed lists from the stack.
            if (listStack.length > this.listTypes.length) {
                listStack.splice(this.listTypes.length);
            }

            // 1. If the listStack is the same length as the listTypes for this item, check
            // if the last item needs to change, and remove it if needed. We can always re-use
            // the other lists even if the type doesn't match - since the display is the same
            // as long as the list immediately surrounding the item is correct.
            const listStackEndIndex = listStack.length - 1;
            if (
                listStackEndIndex === this.listTypes.length - 1 && // they are the same length
                getListTypeFromNode(listStack[listStackEndIndex]) !==
                    this.listTypes[listStackEndIndex]
            ) {
                listStack.splice(listStackEndIndex);
            }

            nextLevel = listStack.length;
        } else {
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
        }

        // 2. Add new list elements
        // e.g.:
        //    passed in listStack: Fragment > OL > UL
        //    local listTypes:     null     > OL > UL > UL > OL
        //    then we need to create a UL and a OL tag
        for (; nextLevel < this.listTypes.length; nextLevel++) {
            const stackLength = listStack.length - 1;
            const newList = createListElement(
                listStack[0],
                this.listTypes[nextLevel],
                nextLevel,
                originalRoot
            );

            listStack[stackLength].appendChild(newList);
            listStack.push(newList);

            //If the current node parent is in the same deep child index,
            //apply the styles of the current parent list to the new list
            if (this.getDeepChildIndex(originalRoot) == stackLength) {
                const listStyleType = this.node.parentElement?.style.listStyleType;
                if (
                    listStyleType &&
                    getTagOfNode(this.node.parentElement) === getTagOfNode(newList)
                ) {
                    newList.style.listStyleType = listStyleType;
                }
            }
        }
        // 3. Add current node into deepest list element
        listStack[listStack.length - 1].appendChild(this.node);
        this.node.style.setProperty('display', this.dummy ? 'block' : null);

        // 4. Inherit styles of the child element to the li, so we are able to apply the styles to the ::marker
        if (this.listTypes.length > 1) {
            setListItemStyle(this.node, stylesToInherit, true /*isCssStyle*/);
            setListItemStyle(this.node, attrsToInherit, false /*isCssStyle*/);
        }

        // 5. If this is not a list item now, need to unwrap the LI node and do proper handling
        if (this.listTypes.length <= 1) {
            // If original <LI> node has styles for font and color, we need to apply it to new parent
            const isLi = getTagOfNode(this.node) == 'LI';
            const stylesToApply = isLi
                ? {
                      'font-family': this.node.style.fontFamily,
                      'font-size': this.node.style.fontSize,
                      color: this.node.style.color,
                  }
                : undefined;

            const childNodes = isLi ? getChildrenAndUnwrap(this.node) : [this.node];

            if (stylesToApply) {
                for (let i = 0; i < childNodes.length; i++) {
                    if (safeInstanceOf(childNodes[i], 'Text')) {
                        childNodes[i] = wrap(childNodes[i], 'span');
                    }

                    const node = childNodes[i];

                    if (safeInstanceOf(node, 'HTMLElement')) {
                        const styles = {
                            ...stylesToApply,
                            ...getStyles(node),
                        };
                        setStyles(node, styles);

                        attrsToInherit.forEach(attr => {
                            const attrValue = this.node.getAttribute(attr);

                            if (attrValue) {
                                node.setAttribute(attr, attrValue);
                            }
                        });
                    }
                }
            }

            wrapIfNotBlockNode(childNodes, true /*checkFirst*/, true /*checkLast*/);
        }
    }

    /**
     * Get the index of how deep is the current node parent list inside of the original root list.
     * @example In the following structure this function would return 2
     * ```html
     *  <ol> <!-- original Root -->
     *      <ol>
     *          <ol>
     *              <li></li> <!-- this.node  -->
     *          </ol>
     *      </ol>
     *  </ol>
     * ```
     * @param originalRoot The root list
     * @returns -1  if the node does not have parent element or if original root was not provided,
     *              else, how deep is the parent element inside of the original root.
     */
    private getDeepChildIndex(originalRoot: HTMLOListElement | HTMLUListElement | undefined) {
        let parentElement = this.node.parentElement;
        if (originalRoot && parentElement) {
            let deepIndex = 0;
            while (parentElement && parentElement != originalRoot) {
                deepIndex++;
                parentElement = parentElement?.parentElement || null;
            }
            return deepIndex;
        }
        return -1;
    }
}

function createListElement(
    newRoot: Node,
    listType: ListType | CompatibleListType,
    nextLevel: number,
    originalRoot?: HTMLOListElement | HTMLUListElement
): HTMLOListElement | HTMLUListElement {
    const doc = newRoot.ownerDocument!;
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
            moveChildNodes(originalRoot);
            result = originalRoot;
        }
    } else {
        // Can't be reused, can't clone, let's create a new one
        result = doc.createElement(listType == ListType.Ordered ? 'ol' : 'ul');
    }

    // Always maintain the metadata saved in the list
    if (originalRoot && nextLevel == 1 && listType != getListTypeFromNode(originalRoot)) {
        const style = getMetadata<ListStyleMetadata>(originalRoot, ListStyleDefinitionMetadata);
        if (style) {
            setMetadata(result, style, ListStyleDefinitionMetadata);
        }
    }

    if (listType == ListType.Ordered && nextLevel > 1) {
        result.style.setProperty(
            'list-style-type',
            orderListStyles[(nextLevel - 1) % orderListStyles.length]
        );
    }

    if (listType == ListType.Unordered && nextLevel > 1) {
        result.style.setProperty(
            'list-style-type',
            unorderedListStyles[(nextLevel - 1) % unorderedListStyles.length]
        );
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
