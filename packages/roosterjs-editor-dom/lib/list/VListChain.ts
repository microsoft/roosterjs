import arrayPush from '../jsUtils/arrayPush';
import getRootListNode from './getRootListNode';
import isNodeAfter from '../utils/isNodeAfter';
import isNodeInRegion from '../region/isNodeInRegion';
import queryElements from '../utils/queryElements';
import VList from './VList';
import { ListType, RegionBase } from 'roosterjs-editor-types';

const CHAIN_NAME_PREFIX = '__List_Chain_';
const CHAIN_DATASET_NAME = 'listchain';
const AFTER_CURSOR_DATASET_NAME = 'listchainafter';
let lastChainIndex = 0;

/**
 * Represent a chain of list nodes.
 * A chain of lists is a virtual link of lists that have continuous numbers, when editor one of them,
 * all others should also be updated in order to main the list number to be continuous.
 */
export default class VListChain {
    private lastNumber = 0;
    private lastNumberBeforeCursor = 0;

    /**
     * Create an array of VListChain from current region in editor
     * @param region The region to create VListChain from
     * @param currentNode Optional current node, used for mark lists that are after this node
     * @param nameGenerator Used by test code only
     */
    static createListChains(
        region: RegionBase | RegionBase[],
        currentNode?: Node,
        nameGenerator?: () => string
    ): VListChain[] {
        const regions = Array.isArray(region) ? region : region ? [region] : [];
        const result: VListChain[] = [];
        regions.forEach(region => {
            const chains: VListChain[] = [];
            let lastList: HTMLOListElement;

            queryElements(region.rootNode, 'ol', ol => {
                const list = getRootListNode(region, 'ol', ol);

                if (lastList != list) {
                    const chain =
                        chains.filter(c => c.canAppendToTail(list))[0] ||
                        new VListChain(region, (nameGenerator || createListChainName)());
                    const index = chains.indexOf(chain);
                    const afterCurrentNode = !!currentNode && isNodeAfter(list, currentNode);

                    if (!afterCurrentNode) {
                        // Make sure current one is at the front if current block has not been met, so that
                        // the first chain is always the nearest one from current node
                        if (index >= 0) {
                            chains.splice(index, 1);
                        }

                        chains.unshift(chain);
                    } else if (index < 0) {
                        chains.push(chain);
                    }

                    chain.append(list, afterCurrentNode);
                    lastList = list;
                }
            });

            arrayPush(result, chains);
        });

        return result;
    }

    /**
     * Check if a list with the given start number can be appended next to the last list before cursor
     * @param startNumber The start number of the new list
     */
    canAppendAtCursor(startNumber: number): boolean {
        return startNumber > 1 && this.lastNumberBeforeCursor + 1 == startNumber;
    }

    /**
     * Create a VList to wrap the block of the given node, and append to current chain
     * @param container The container node to create list at
     * @param startNumber Start number of the new list
     */
    createVListAtBlock(container: Node, startNumber: number): VList | null {
        if (container && container.parentNode) {
            const list = container.ownerDocument!.createElement('ol');

            list.start = startNumber;
            this.applyChainName(list);
            container.parentNode.insertBefore(list, container);

            const vList = new VList(list);

            vList.appendItem(container, ListType.None);
            return vList;
        } else {
            return null;
        }
    }

    /**
     * After change the lists, commit the change to all lists in this chain to update the list number,
     * and clear the temporary dataset values added to list node
     */
    commit(shouldReuseAllAncestorListElements?: boolean) {
        const lists = this.getLists();
        let lastNumber = 0;

        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];

            //If there is a list chain sequence, ensure the list chain keep increasing correctly
            if (list.start > 1) {
                list.start = list.start === lastNumber ? lastNumber + 1 : list.start;
            } else {
                list.start = lastNumber + 1;
            }

            const vlist = new VList(list);
            lastNumber = vlist.getLastItemNumber() || 0;

            delete list.dataset[CHAIN_DATASET_NAME];
            delete list.dataset[AFTER_CURSOR_DATASET_NAME];

            vlist.writeBack(shouldReuseAllAncestorListElements);
        }
    }

    /**
     * Construct a new instance of VListChain class
     * @param editor Editor object
     */
    private constructor(private region: RegionBase, private name: string) {}

    /**
     * Check if the given list node is can be appended into current list chain
     * @param list The list node to check
     */
    private canAppendToTail(list: HTMLOListElement) {
        return this.lastNumber + 1 == list.start;
    }

    /**
     * Append the given list node into this VListChain
     * @param list The list node to append
     * @param isAfterCurrentNode Whether this list is after current node
     */
    private append(list: HTMLOListElement, isAfterCurrentNode: boolean) {
        this.applyChainName(list);
        this.lastNumber = new VList(list).getLastItemNumber() || 0;

        if (isAfterCurrentNode) {
            list.dataset[AFTER_CURSOR_DATASET_NAME] = 'true';
        } else {
            this.lastNumberBeforeCursor = this.lastNumber;
        }
    }

    private applyChainName(list: HTMLOListElement) {
        list.dataset[CHAIN_DATASET_NAME] = this.name;
    }

    private getLists() {
        return queryElements(
            this.region.rootNode,
            `ol[data-${CHAIN_DATASET_NAME}=${this.name}]`
        ).filter(node => isNodeInRegion(this.region, node)) as HTMLOListElement[];
    }
}

function createListChainName() {
    return CHAIN_NAME_PREFIX + lastChainIndex++;
}
