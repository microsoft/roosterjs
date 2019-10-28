import {
    WORD_ORDERED_LIST_SELECTOR,
    WORD_UNORDERED_LIST_SELECTOR,
    WORD_ONLINE_IDENTIFYING_SELECTOR,
    LIST_CONTAINER_ELEMENT_CLASS_NAME,
    ORDERED_LIST_TAG_NAME,
    UNORDERED_LIST_TAG_NAME
} from './constants';

import {
    splitParentNode,
    getNextLeafSibling,
    getFirstLeafNode,
    getTagOfNode,
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
    sanitizeListItemContainer(doc);
    const listItemBlocks: ListItemBlock[] = getListItemBlocks(doc);

    listItemBlocks.forEach((itemBlock) => {

        // There are cases where consecutive List Elements are seperated into different divs:
        // <div>
        //   <div>
        //      <ol></ol>
        //   </div>
        //   <div>
        //      <ol></ol>
        //   </div>
        // </div>
        // <div>
        //   <div>
        //      <ol></ol>
        //   </div>
        // </div>
        // in the above case we want to collapse the two root level div into one and unwrap the list item divs.
        // after the following flattening the list will become following:
        //
        // <div>
        //    <ol></ol>
        // </div>
        // <div>
        //    <ol></ol>
        // </div>
        // <div>
        //    <ol></ol>
        // </div>
        // Then we are start processing.
        flattenListBlock(doc.body, itemBlock);

        // Find the node to insertBefore, which is next sibling node of the end of a listItemBlock.
        itemBlock.insertPositionNode = itemBlock.endElement.nextSibling;

        let convertedListElement: Element;
        itemBlock.listItemContainers.forEach((listItemContainer) => {
            let listType: 'OL' | 'UL' = getContainerListType(listItemContainer); // list type that is contained by iterator.
            // Initialize processed element with propery listType if this is the first element
            if (!convertedListElement) {
                convertedListElement = doc.createElement(listType);
            }

            // Get all list items(<li>) in the current iterator element.
            const currentListItems = listItemContainer.querySelectorAll('li');
            currentListItems.forEach((item) => {
                // If item is in root level and the type of list changes then
                // insert the current list into body and then reinitialize the convertedListElement
                // Word Online is using data-aria-level to determine the the depth of the list item.
                const itemLevel = parseInt(item.getAttribute('data-aria-level'));
                // In first level list, there are cases where a consecutive list item divs may have different list type
                // When that happens we need to insert the processed elements into the document, then change the list type
                // and keep the processing going.
                if (getTagOfNode(convertedListElement) != listType && itemLevel == 1) {
                    insertConvertedListToDoc(convertedListElement, doc.body, itemBlock);
                    convertedListElement = doc.createElement(listType);
                }
                insertListItem(convertedListElement, item, listType, doc);
            });
        });

        insertConvertedListToDoc(convertedListElement, doc.body, itemBlock);

        // Once we finish the process the list items and put them into a list.
        // After inserting the processed element,
        // we need to remove all the non processed node from the parent node.
        const parentContainer = itemBlock.startElement.parentNode;
        if (parentContainer) {
            itemBlock.listItemContainers.forEach((listItemContainer) => {
                parentContainer.removeChild(listItemContainer);
            });
        }
    });
}

/**
 * The node processing is based on the premise of only ol/ul is in ListContainerWrapper class
 * However the html might be melformed, this function is to split all the other elements out of ListContainerWrapper
 * @param doc pasted document that contains all the list element.
 */
function sanitizeListItemContainer(doc: HTMLDocument) {
    const listItemContainerListEl = doc.querySelectorAll(`${WORD_ORDERED_LIST_SELECTOR}, ${WORD_UNORDERED_LIST_SELECTOR}`);
    listItemContainerListEl.forEach((el) => {
        const replaceRegex = new RegExp(`\\b${LIST_CONTAINER_ELEMENT_CLASS_NAME}\\b`, 'g');
        if (el.previousSibling) {
            const prevParent = splitParentNode(el, true) as HTMLElement;
            prevParent.className = prevParent.className.replace(replaceRegex, '');
        }
        if (el.nextSibling) {
            const nextParent = splitParentNode(el, false) as HTMLElement;
            nextParent.className = nextParent.className.replace(replaceRegex, '');
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
            if (curItem == lastItemInCurBlock.nextSibling
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
    collapsedListItemSections.forEach((section) => {
        if (getTagOfNode(section.firstChild) == 'DIV') {
            unwrap(section)
        }
    })
}

/**
 * Get the list type that the container contains. If there is no list in the container
 * return null;
 * @param listItemContainer Container that contains a list
 */
function getContainerListType(listItemContainer: Element): 'OL' | 'UL' | null {
    const tag = getTagOfNode(listItemContainer.firstChild);
    return tag == UNORDERED_LIST_TAG_NAME || tag == ORDERED_LIST_TAG_NAME ? tag : null;
}

/**
 * Insert list item into the correct position of a list
 * @param listRootElement Root element of the list that is accepting a coming element.
 * @param itemToInsert List item that needed to be inserted.
 * @param listType Type of list(ul/ol)
 */
function insertListItem(listRootElement: Element, itemToInsert: HTMLElement, listType: string, doc: HTMLDocument): void {
    if (!listType) {
        return
    }
    // Get item level from 'data-aria-level' attribute
    let itemLevel = parseInt(itemToInsert.getAttribute('data-aria-level'));
    let curListLevel = listRootElement; // Level iterator to find the correct place for the current element.
    // if the itemLevel is 1 it means the level iterator is at the correct place.
    while (itemLevel > 1) {
        if (!curListLevel.firstChild) {
            // If the current level is empty, create empty list within the current level
            // then move the level iterator into the next level.
            curListLevel.append(doc.createElement(listType));
            curListLevel = curListLevel.firstElementChild;
        } else {
            // If the current level is not empty, the last item in the needs to be a UL or OL
            // and the level iterator should move to the UL/OL at the last position.
            let lastChild = curListLevel.lastElementChild;
            let lastChildTag = getTagOfNode(lastChild);
            if (lastChildTag == UNORDERED_LIST_TAG_NAME || lastChildTag == ORDERED_LIST_TAG_NAME) {
                // If the last child is a list(UL/OL), then move the level iterator to last child.
                curListLevel = lastChild;
            } else {
                // If the last child is not a list, then append a new list to the level
                // and move the level iterator to the new level.
                curListLevel.append(doc.createElement(listType))
                curListLevel = curListLevel.lastElementChild;
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

    const { insertPositionNode } = listItemBlock;
    if (insertPositionNode) {
        const { parentElement } = insertPositionNode;
        if (parentElement) {
            parentElement.insertBefore(convertedListElement, insertPositionNode);
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