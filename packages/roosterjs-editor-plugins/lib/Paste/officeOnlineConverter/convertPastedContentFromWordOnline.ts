import {
    WORD_ONLINE_IDENTIFYING_SELECTOR,
    LIST_CONTAINER_ELEMENT_CLASS_NAME,
    ORDERED_LIST_TAG_NAME,
    UNORDERED_LIST_TAG_NAME
} from './constants';

import {
    getNextLeafSibling,
    getFirstLeafNode,
    collapseNodes,
    unwrap
} from 'roosterjs-editor-dom';

import ListItemBlock, { createListItemBlock } from './ListItemBlock';


export function isWordOnlineWithList(node: HTMLElement): boolean {
    return !!(node && node.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR));
}

// Word Online pasted content DOM structure as of July 12th 2019
//<html>
//  <body>
//      <div class='OutlineGroup'>  ----------> this layer may exist depend on the content user paste
//          <div class="OutlineElement">  ----------> text content
//              <p></p>
//          </div>
//          <div class="ListItemWrapper">  ----------> list items: for unordered list, all the items on the same level is under the same wrapper
//              <ul>                                       list items in the same list can be divided into different ListItemWrapper
//                  <li></li>                              list items in the same list can also be divided into different Outline Group;
//                  <li></li>
//              </ul>
//          </div>
//      </div>
//      <div class='OutlineGroup'>
//          <div class="ListItemWrapper">  ----------> list items: for ordered list, each items has it's own wrapper
//              <ol>
//                  <li></li>
//              </ol>
//          </div>
//          <div class="ListItemWrapper">
//              <ol>
//                  <li></li>
//              </ol>
//          </div>
//      </div>
//  </body>
//</html>
//

/**
 * Convert text copied from word online into text that's workable with rooster editor
 * @param doc Document that is being pasted into editor.
 */
export default function convertPastedContentFromWordOnline(doc: HTMLDocument) {
    const listItemBlocks: ListItemBlock[] = getListItemBlocks(doc);

    listItemBlocks.forEach((itemBlock) => {

        flattenListBlock(doc.body, itemBlock);

        itemBlock.insertPositionElement = itemBlock.endElement.nextElementSibling;

        let convertedListElement: Element;
        itemBlock.listItemContainers.forEach((listItemContainer) => {
            let listType: string = getContainerListType(listItemContainer); // list type that is contained by iterator.

            // Initialize processed element with propery listType if the
            if (!convertedListElement) {
                convertedListElement = document.createElement(listType);
            }

            // Get all list items(<li>) in the current iterator element.
            const currentListItems = listItemContainer.querySelectorAll('li');
            currentListItems.forEach((item) => {
                insertListItem(convertedListElement, item, listType);
            })
        });

        insertConvertedListToDoc(convertedListElement, doc.body, itemBlock);

        const parentContainer = itemBlock.startElement.parentElement;
        if (parentContainer) {
            itemBlock.listItemContainers.forEach((listItemContainer) => {
                parentContainer.removeChild(listItemContainer);
            });
        }
    });
}

/**
 * Take all the list items in the document, and group the consecutive list times in a list block;
 * @param doc pasted document that contains all the list element.
 */
function getListItemBlocks(doc: HTMLDocument): ListItemBlock[] {
    const listElements = doc.getElementsByClassName(LIST_CONTAINER_ELEMENT_CLASS_NAME);
    const result: ListItemBlock[] = [];
    let curListItemBlock: ListItemBlock;
    for (let i = 0; i < listElements.length; i++) {
        let curItem = listElements[i];
        if (!curListItemBlock) {
            curListItemBlock = createListItemBlock(curItem)
        } else {
            const { listItemContainers } = curListItemBlock;
            const lastItemInCurBlock = listItemContainers[listItemContainers.length - 1];
            if (curItem.isEqualNode(lastItemInCurBlock.nextElementSibling)
                || getFirstLeafNode(curItem) == getNextLeafSibling(doc.body, lastItemInCurBlock)) {
                listItemContainers.push(curItem);
                curListItemBlock.endElement = curItem
            } else {
                curListItemBlock.endElement = lastItemInCurBlock;
                result.push(curListItemBlock);
                curListItemBlock = createListItemBlock(curItem);
            }
        }
    }

    if (curListItemBlock.listItemContainers.length > 0) {
        result.push(curListItemBlock);
    }

    return result;
}

/**
 * Flatten the list items, so that all the consecutive list items are under the same parent.
 * @param doc Root element of that contains the element.
 * @param listItemBlock The list item block needed to be flattened.
 */
function flattenListBlock(rootElement: Element, listItemBlock: ListItemBlock) {
    const collapsedListItemSections = collapseNodes(rootElement, listItemBlock.startElement, listItemBlock.endElement, true);
    if (collapsedListItemSections.length > 1) {
        collapsedListItemSections.forEach((section) => {
            if (section.firstChild && section.firstChild.nodeName == 'DIV') {
                unwrap(section)
            }
        })
    }
}

/**
 * Get the list type that the container contains. If there is no list in the container
 * return null;
 * @param listItemContainer Container that contains a list
 */
function getContainerListType(listItemContainer: Element): string {
    if (listItemContainer.querySelector(UNORDERED_LIST_TAG_NAME)) {
        return UNORDERED_LIST_TAG_NAME;
    } else if (listItemContainer.querySelector(ORDERED_LIST_TAG_NAME)) {
        return ORDERED_LIST_TAG_NAME
    } else {
        return null
    }
}

/**
 * Insert list item into the correct position of a list
 * @param listRootElement Root element of the list that is accepting a coming element.
 * @param itemToInsert List item that needed to be inserted.
 * @param listType Type of list(ul/ol)
 */
function insertListItem(listRootElement: Element, itemToInsert: Element, listType: string): void {
    if (!listType) {
        return
    }
    // Get item level from 'data-aria-level' attribute
    let itemLevel = parseInt(itemToInsert.getAttribute('data-aria-level'));
    let curListLevel = listRootElement; // Level iterator to find the correct place for the current element.
    // Word only uses margin to indent and hide list-style(bullet point)
    // So we need to remove the style from the list item.
    itemToInsert.removeAttribute('style');
    // if the itemLevel is 1 it means the level iterator is at the correct place.
    while (itemLevel > 1) {
        if (curListLevel.children.length == 0) {
            // If the current level is empty, create empty list within the current level
            // then move the level iterator into the next level.
            curListLevel.append(document.createElement(listType));
            curListLevel = curListLevel.children[0];
        } else {
            // If the current level is not empty, the last item in the needs to be a UL or OL
            // and the level iterator should move to the UL/OL at the last position.
            let { children } = curListLevel;
            let lastChild = children[children.length - 1];
            if (lastChild.tagName == UNORDERED_LIST_TAG_NAME || lastChild.tagName == ORDERED_LIST_TAG_NAME) {
                // If the last child is a list(UL/OL), then move the level iterator to last child.
                curListLevel = lastChild;
            } else {
                // If the last child is not a list, then append a new list to the level
                // and move the level iterator to the new level.
                curListLevel.append(document.createElement(listType))
                curListLevel = children[children.length - 1];
            }
        }
        itemLevel--;
    }

    // Once the level iterator is at the right place, then append the list item in the level.
    curListLevel.appendChild(itemToInsert);
}

/**
 * Insert the converted list item into the correct place.
 * @param convertedListElement List element that is converted from list item block
 * @param rootElement Root element of that contains the converted listItemBlock
 * @param listItemBlock List item block that was converted.
 */
function insertConvertedListToDoc(convertedListElement: Element, rootElement: Element, listItemBlock: ListItemBlock) {
    if (!convertedListElement) {
        return;
    }

    const { insertPositionElement } = listItemBlock;
    if (insertPositionElement) {
        const { parentElement } = insertPositionElement;
        if (parentElement) {
            parentElement.insertBefore(convertedListElement, insertPositionElement);
        }
    } else {
        const { parentElement } = listItemBlock.startElement;
        if (parentElement) {
            parentElement.appendChild(convertedListElement)
        } else {
            rootElement.append(convertedListElement);
        }
    }
}