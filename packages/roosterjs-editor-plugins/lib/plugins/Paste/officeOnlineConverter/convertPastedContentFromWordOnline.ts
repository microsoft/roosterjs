import ListItemBlock, { createListItemBlock } from './ListItemBlock';

import {
    splitParentNode,
    getNextLeafSibling,
    getFirstLeafNode,
    getTagOfNode,
    collapseNodes,
    unwrap,
    toArray,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

const WORD_ONLINE_IDENTIFYING_SELECTOR =
    'div.ListContainerWrapper>ul[class^="BulletListStyle"],div.ListContainerWrapper>ol[class^="NumberListStyle"],span.WACImageContainer > img';
const LIST_CONTAINER_ELEMENT_CLASS_NAME = 'ListContainerWrapper';
const IMAGE_CONTAINER_ELEMENT_CLASS_NAME = 'WACImageContainer';

//When the list style is a symbol and the value is not in the clipboard, WordOnline
const VALID_LIST_STYLE_CHAR_CODES = [
    '111', //'o'
    '9643', //'▫'
    '9830', //'♦'
];

/**
 * @internal
 */
export function isWordOnlineWithList(fragment: DocumentFragment): boolean {
    return !!(fragment && fragment.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR));
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
 * @internal
 * Convert text copied from word online into text that's workable with rooster editor
 * @param fragment Document fragment that is being pasted into editor.
 */
export default function convertPastedContentFromWordOnline(fragment: DocumentFragment) {
    sanitizeListItemContainer(fragment);
    const listItemBlocks: ListItemBlock[] = getListItemBlocks(fragment);

    listItemBlocks.forEach(itemBlock => {
        // There are cases where consecutive List Elements are separated into different nodes:
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
        // in the above case we want to collapse the two root level div into one and unwrap the list item nodes.
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
        flattenListBlock(fragment, itemBlock);

        // Find the node to insertBefore, which is next sibling node of the end of a listItemBlock.
        itemBlock.insertPositionNode = itemBlock.endElement?.nextSibling ?? null;

        let convertedListElement: Element | undefined = undefined;
        const doc = fragment.ownerDocument;

        itemBlock.listItemContainers.forEach(listItemContainer => {
            let listType: 'OL' | 'UL' | null = getContainerListType(listItemContainer); // list type that is contained by iterator.
            if (listType) {
                // Initialize processed element with proper listType if this is the first element
                if (!convertedListElement) {
                    convertedListElement = createNewList(listItemContainer, doc, listType);
                }

                // Get all list items(<li>) in the current iterator element.
                const currentListItems = toArray(listItemContainer.querySelectorAll('li'));
                currentListItems.forEach(item => {
                    // If item is in root level and the type of list changes then
                    // insert the current list into body and then reinitialize the convertedListElement
                    // Word Online is using data-aria-level to determine the the depth of the list item.
                    const itemLevel = parseInt(item.getAttribute('data-aria-level') ?? '');
                    // In first level list, there are cases where a consecutive list item DIV may have different list type
                    // When that happens we need to insert the processed elements into the document, then change the list type
                    // and keep the processing going.
                    if (
                        convertedListElement &&
                        getTagOfNode(convertedListElement) != listType &&
                        itemLevel == 1 &&
                        listType
                    ) {
                        insertConvertedListToDoc(convertedListElement, fragment, itemBlock);
                        convertedListElement = createNewList(listItemContainer, doc, listType);
                    }
                    if (convertedListElement && listType) {
                        insertListItem(convertedListElement, item, listType, doc);
                    }
                });
            }
        });
        if (convertedListElement) {
            insertConvertedListToDoc(convertedListElement, fragment, itemBlock);
        }

        // Once we finish the process the list items and put them into a list.
        // After inserting the processed element,
        // we need to remove all the non processed node from the parent node.
        const parentContainer = itemBlock.startElement?.parentNode;
        if (parentContainer) {
            itemBlock.listItemContainers.forEach(listItemContainer => {
                parentContainer.removeChild(listItemContainer);
            });
        }
    });

    const imageNodes = getImageNodes(fragment);
    imageNodes.forEach(node => {
        //   Structure when pasting Word Wac Image as of 10/22/2021
        //   <span class='WACImageContainer'>
        //        <img class="WACImage" >
        //        <span style="display:block">
        //        </span>
        //   </span>
        //
        //   Since the second span inside of WACImageContainer have style display block it displays an additional space at the bottom of the image.
        //   Removing the nodes that are not img will resolve the additional space
        if (safeInstanceOf(node, 'HTMLSpanElement')) {
            node.childNodes.forEach(childNode => {
                if (getTagOfNode(childNode) != 'IMG') {
                    childNode.parentElement?.removeChild(childNode);
                }
            });
        }
    });
}

function createNewList(listItemContainer: Element, doc: Document, tag: 'OL' | 'UL') {
    const newList = doc.createElement(tag);
    const startAttribute = listItemContainer.firstElementChild?.getAttribute('start');
    if (startAttribute) {
        newList.setAttribute('start', startAttribute);
    }
    return newList;
}

/**
 * The node processing is based on the premise of only ol/ul is in ListContainerWrapper class
 * However the html might be malformed, this function is to split all the other elements out of ListContainerWrapper
 * @param fragment pasted document that contains all the list element.
 */
function sanitizeListItemContainer(fragment: DocumentFragment) {
    const listItemContainerListEl = toArray(
        fragment.querySelectorAll(WORD_ONLINE_IDENTIFYING_SELECTOR)
    );
    listItemContainerListEl.forEach(el => {
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
 * @param fragment pasted document that contains all the list element.
 */
function getListItemBlocks(fragment: DocumentFragment): ListItemBlock[] {
    const listElements = fragment.querySelectorAll('.' + LIST_CONTAINER_ELEMENT_CLASS_NAME);
    const result: ListItemBlock[] = [];
    let curListItemBlock: ListItemBlock | null = null;
    for (let i = 0; i < listElements.length; i++) {
        let curItem = listElements[i];
        if (!curListItemBlock) {
            curListItemBlock = createListItemBlock(curItem);
        } else {
            const { listItemContainers } = curListItemBlock;
            const lastItemInCurBlock = listItemContainers[listItemContainers.length - 1];
            if (
                curItem == lastItemInCurBlock.nextSibling ||
                (lastItemInCurBlock.parentNode &&
                    getFirstLeafNode(curItem) ==
                        getNextLeafSibling(lastItemInCurBlock.parentNode, lastItemInCurBlock))
            ) {
                listItemContainers.push(curItem);
                curListItemBlock.endElement = curItem;
            } else {
                curListItemBlock.endElement = lastItemInCurBlock;
                result.push(curListItemBlock);
                curListItemBlock = createListItemBlock(curItem);
            }
        }
    }

    if (curListItemBlock && curListItemBlock.listItemContainers.length > 0) {
        result.push(curListItemBlock);
    }

    return result;
}

/**
 * Flatten the list items, so that all the consecutive list items are under the same parent.
 * @param fragment Root element of that contains the element.
 * @param listItemBlock The list item block needed to be flattened.
 */
function flattenListBlock(fragment: DocumentFragment, listItemBlock: ListItemBlock) {
    if (listItemBlock.startElement && listItemBlock.endElement) {
        const collapsedListItemSections = collapseNodes(
            fragment,
            listItemBlock.startElement,
            listItemBlock.endElement,
            true
        );
        collapsedListItemSections.forEach(section => {
            if (getTagOfNode(section.firstChild) == 'DIV') {
                unwrap(section);
            }
        });
    }
}

/**
 * Get the list type that the container contains. If there is no list in the container
 * return null;
 * @param listItemContainer Container that contains a list
 */
function getContainerListType(listItemContainer: Element): 'OL' | 'UL' | null {
    const tag = getTagOfNode(listItemContainer.firstChild);
    return tag == 'UL' || tag == 'OL' ? tag : null;
}

/**
 * Insert list item into the correct position of a list
 * @param listRootElement Root element of the list that is accepting a coming element.
 * @param itemToInsert List item that needed to be inserted.
 * @param listType Type of list(ul/ol)
 */
function insertListItem(
    listRootElement: Element,
    itemToInsert: HTMLElement,
    listType: 'UL' | 'OL',
    doc: HTMLDocument
): void {
    if (!listType) {
        return;
    }
    // Get item level from 'data-aria-level' attribute
    let itemLevel = parseInt(itemToInsert.getAttribute('data-aria-level') ?? '');

    // Try to reuse the List Marker
    let style = itemToInsert.getAttribute('data-leveltext');
    if (
        listType == 'UL' &&
        style &&
        VALID_LIST_STYLE_CHAR_CODES.indexOf(style.charCodeAt(0).toString()) > -1
    ) {
        itemToInsert.style.listStyleType = `"${style}  "`;
    }

    let curListLevel = listRootElement; // Level iterator to find the correct place for the current element.
    // if the itemLevel is 1 it means the level iterator is at the correct place.
    while (itemLevel > 1) {
        if (!curListLevel.firstChild) {
            // If the current level is empty, create empty list within the current level
            // then move the level iterator into the next level.
            curListLevel.appendChild(doc.createElement(listType));
            if (curListLevel.firstElementChild) {
                curListLevel = curListLevel.firstElementChild;
            }
        } else {
            // If the current level is not empty, the last item in the needs to be a UL or OL
            // and the level iterator should move to the UL/OL at the last position.
            let lastChild = curListLevel.lastElementChild;
            let lastChildTag = getTagOfNode(lastChild);
            if (lastChild && (lastChildTag == 'UL' || lastChildTag == 'OL')) {
                // If the last child is a list(UL/OL), then move the level iterator to last child.
                curListLevel = lastChild;
            } else {
                // If the last child is not a list, then append a new list to the level
                // and move the level iterator to the new level.
                curListLevel.appendChild(doc.createElement(listType));
                if (curListLevel.lastElementChild) {
                    curListLevel = curListLevel.lastElementChild;
                }
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
 * @param fragment Root element of that contains the converted listItemBlock
 * @param listItemBlock List item block that was converted.
 */
function insertConvertedListToDoc(
    convertedListElement: Element,
    fragment: DocumentFragment,
    listItemBlock: ListItemBlock
) {
    if (!convertedListElement) {
        return;
    }

    const { insertPositionNode } = listItemBlock;
    if (insertPositionNode) {
        const parentNode = insertPositionNode.parentNode;
        if (parentNode) {
            parentNode.insertBefore(convertedListElement, insertPositionNode);
        }
    } else {
        const parentNode = listItemBlock.startElement?.parentNode;
        if (parentNode) {
            parentNode.appendChild(convertedListElement);
        } else {
            fragment.appendChild(convertedListElement);
        }
    }
}

function getImageNodes(fragment: DocumentFragment) {
    return fragment.querySelectorAll('.' + IMAGE_CONTAINER_ELEMENT_CLASS_NAME);
}
