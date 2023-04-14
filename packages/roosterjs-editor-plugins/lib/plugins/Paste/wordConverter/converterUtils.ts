import ListItemMetadata from './ListItemMetadata';
import ListMetadata from './ListMetadata';
import WordConverter from './wordConverter';
import WordConverterArguments from './WordConverterArguments';
import { createLevelLists } from './LevelLists';
import { getObject, setObject } from './WordCustomData';
import { getStyles, getTagOfNode, moveChildNodes } from 'roosterjs-editor-dom';
import { NodeType } from 'roosterjs-editor-types';

/** Word list metadata style name */
const LOOKUP_DEPTH = 5;

/** Name for the word list id property in the custom data */
const UNIQUE_LIST_ID_CUSTOM_DATA = 'UniqueListId';

/** Word list metadata style name */
const MSO_LIST_STYLE_NAME = 'mso-list';

/** Regular expression to match line breaks */
const LINE_BREAKS = /[\n|\r]/gi;

/**
 * @internal
 * Handles the pass 1: Discovery
 * During discovery, we'll parse the metadata out of the elements and store it in the list items dictionary.
 * We'll detect cases where the list items for a particular ordered list are not next to each other. Word does these
 * for numbered headers, and we don't want to convert those, because the numbering would be completely wrong.
 */
export function processNodesDiscovery(wordConverter: WordConverter): boolean {
    let args = wordConverter.wordConverterArgs;
    if (!args) {
        return false;
    }
    while (args.currentIndex < args.nodes.length) {
        let node = args.nodes.item(args.currentIndex);

        // Try to get the list metadata for the specified node
        let itemMetadata = getListItemMetadata(node);
        if (itemMetadata) {
            let levelInfo =
                args.currentListIdsByLevels[itemMetadata.level - 1] || createLevelLists();
            args.currentListIdsByLevels[itemMetadata.level - 1] = levelInfo;

            // We need to drop some list information if this is not an item next to another
            if (args.lastProcessedItem && getRealPreviousSibling(node) != args.lastProcessedItem) {
                // This list item is not next to the previous one. This means that there is some content in between them
                // so we need to reset our list of list ids per level
                resetCurrentLists(args);
            }

            // Get the list metadata for the list that will hold this item
            let listMetadata = levelInfo.listsMetadata[itemMetadata.wordListId];
            if (!listMetadata) {
                // Get the first item fake bullet.. This will be used later to check what is the right type of list
                let firstFakeBullet = getFakeBulletText(node, LOOKUP_DEPTH);

                // This is a the first item of a list.. We'll create the list metadata using the information
                // we already have from this first item
                listMetadata = {
                    numberOfItems: 0,
                    uniqueListId: wordConverter.nextUniqueId++,
                    firstFakeBullet: firstFakeBullet,

                    // If the bullet we got is empty or not found, we ignore the list out.. this means
                    // that this is not an item we need to convert of that the format doesn't match what
                    // we are expecting
                    ignore: !firstFakeBullet || firstFakeBullet.length == 0,

                    // We'll use the first fake bullet to try to figure out which type of list we create. If this list has a second
                    // item, we'll perform a better comparison, but for one item lists, this will be check that will determine the list type
                    tagName: getFakeBulletTagName(firstFakeBullet),
                };
                levelInfo.listsMetadata[itemMetadata.wordListId] = listMetadata;
                args.lists[listMetadata.uniqueListId.toString()] = listMetadata;
            } else if (!listMetadata.ignore && listMetadata.numberOfItems == 1) {
                // This is the second item we've seen for this list.. we'll compare the 2 fake bullet
                // items we have an decide if we create ordered or unordered lists based on this.
                // This is the best way we can do this since we cannot read the metadata that Word
                // puts in the head of the HTML...
                let secondFakeBullet = getFakeBulletText(node, LOOKUP_DEPTH);
                listMetadata.tagName =
                    listMetadata.firstFakeBullet == secondFakeBullet ? 'UL' : 'OL';
            }

            // Set the unique id to the list
            itemMetadata.uniqueListId = listMetadata.uniqueListId;

            // Check if we need to ignore this list... we'll either know already that we need to ignore
            // it, or we'll know it because the previous list items are not next to this one
            if (
                listMetadata.ignore ||
                (listMetadata.tagName == 'OL' &&
                    listMetadata.numberOfItems > 0 &&
                    levelInfo.currentUniqueListId != itemMetadata.uniqueListId)
            ) {
                // We need to ignore this item... and we also need to forget about the lists that
                // are not at the root level
                listMetadata.ignore = true;
                args.currentListIdsByLevels[0].currentUniqueListId = -1;
                args.currentListIdsByLevels = args.currentListIdsByLevels.slice(0, 1);
            } else {
                // This is an item we don't need to ignore... If added lists deep under this one before
                // we'll drop their ids from the list of ids per level.. this is because this list item
                // breaks the deeper lists.
                if (args.currentListIdsByLevels.length > itemMetadata.level) {
                    args.currentListIdsByLevels = args.currentListIdsByLevels.slice(
                        0,
                        itemMetadata.level
                    );
                }

                levelInfo.currentUniqueListId = itemMetadata.uniqueListId;

                // Add the list item into the list of items to be processed
                args.listItems.push(itemMetadata);
                listMetadata.numberOfItems++;
            }

            args.lastProcessedItem = node;
        } else {
            // Here, we know that this is not a list item, but we'll want to check if it is one "no bullet" list items...
            // these can be created by creating a bullet and hitting delete on it it... The content will continue to be indented, but there will
            // be no bullet and the list will continue correctly after that. Visually, it looks like the previous item has multiple lines, but
            // the HTML generated has multiple paragraphs with the same class. We'll merge these when we find them, so the logic doesn't skips
            // the list conversion thinking that the list items are not together...
            let last = args.lastProcessedItem;
            if (
                last &&
                getRealPreviousSibling(node) == last &&
                node.tagName == last.tagName &&
                node.className == last.className
            ) {
                // Add 2 line breaks and move all the nodes to the last item
                last.appendChild(last.ownerDocument.createElement('br'));
                last.appendChild(last.ownerDocument.createElement('br'));
                moveChildNodes(last, node, true /*keepExistingChildren*/);

                // Remove the item that we don't need anymore
                node.parentNode?.removeChild(node);
            }
        }

        // Move to the next element are return true if more elements need to be processed
        args.currentIndex++;
    }
    return args.listItems.length > 0;
}

/**
 * @internal
 * Handles the pass 2: Conversion
 * During conversion, we'll go over the elements that belong to a list that we've marked as a list to convert, and we'll perform the
 * conversion needed
 */
export function processNodeConvert(wordConverter: WordConverter): boolean {
    let args = wordConverter.wordConverterArgs;
    if (args) {
        args.currentIndex = 0;

        while (args.currentIndex < args.listItems.length) {
            let metadata = args.listItems[args.currentIndex];
            let node = metadata.originalNode;
            let listMetadata = args.lists[metadata.uniqueListId.toString()];
            if (!listMetadata.ignore) {
                // We have a list item that we need to convert, get or create the list
                // that hold this item out
                let list = getOrCreateListForNode(wordConverter, node, metadata, listMetadata);
                if (list) {
                    // Clean the element out.. this call gets rid of the fake bullet and unneeded nodes
                    cleanupListIgnore(node, LOOKUP_DEPTH);

                    // Create a new list item and transfer the children
                    let li = node.ownerDocument.createElement('LI');
                    if (getTagOfNode(node).startsWith('H')) {
                        const clone = node.cloneNode(true /* deep */) as HTMLHeadingElement;
                        clone.style.textIndent = '';
                        clone.style.marginLeft = '';
                        clone.style.marginRight = '';
                        li.appendChild(clone);
                    } else {
                        moveChildNodes(li, node);
                    }

                    // Append the list item into the list
                    list.appendChild(li);

                    // Remove the node we just converted
                    node.parentNode?.removeChild(node);

                    if (listMetadata.tagName == 'UL') {
                        wordConverter.numBulletsConverted++;
                    } else {
                        wordConverter.numNumberedConverted++;
                    }
                }
            }
            args.currentIndex++;
        }
    }
    return wordConverter.numBulletsConverted > 0 || wordConverter.numNumberedConverted > 0;
}

/**
 * Gets or creates the list (UL or OL) that holds this item out based on the
 * items content and the specified metadata
 */
function getOrCreateListForNode(
    wordConverter: WordConverter,
    node: HTMLElement,
    metadata: ListItemMetadata,
    listMetadata: ListMetadata
): Node {
    // First get the last list next to this node under the specified level. This code
    // path will return the list or will create lists if needed
    let list = recurringGetOrCreateListAtNode(node, metadata.level, listMetadata);

    // Here use the unique list ID to detect if we have the right list...
    // it is possible to have 2 different lists next to each other with different formats, so
    // we want to detect this an create separate lists for those cases
    let listId = getObject(wordConverter.wordCustomData, list, UNIQUE_LIST_ID_CUSTOM_DATA);

    // If we have a list with and ID, but the ID is different than the ID for this list item, this
    // is a completely new list, so we'll append a new list for that
    if ((listId && listId != metadata.uniqueListId) || (!listId && list.firstChild)) {
        let newList = node.ownerDocument.createElement(listMetadata.tagName);
        list.parentNode?.insertBefore(newList, list.nextSibling);
        list = newList;
    }

    // Set the list id into the custom data
    setObject(
        wordConverter.wordCustomData,
        list,
        UNIQUE_LIST_ID_CUSTOM_DATA,
        metadata.uniqueListId
    );

    // This call will convert the list if needed to the right type of list required. This can happen
    // on the cases where the first list item for this list is located after a deeper list. for that
    // case, we will have created a UL for it, and we may need to convert it
    return convertListIfNeeded(wordConverter, list, listMetadata);
}

/**
 * Converts the list between UL and OL if needed, by using the fake bullet and
 * information already stored in the list itself
 */
function convertListIfNeeded(
    wordConverter: WordConverter,
    list: Node,
    listMetadata: ListMetadata
): Node {
    // Check if we need to convert the list out
    if (listMetadata.tagName != getTagOfNode(list)) {
        // We have the wrong list type.. convert it, set the id again and transfer all the children
        let newList = list.ownerDocument?.createElement(listMetadata.tagName);
        if (newList) {
            setObject(
                wordConverter.wordCustomData,
                newList,
                UNIQUE_LIST_ID_CUSTOM_DATA,
                getObject(wordConverter.wordCustomData, list, UNIQUE_LIST_ID_CUSTOM_DATA)
            );
            moveChildNodes(newList, list);

            list.parentNode?.insertBefore(newList, list);
            list.parentNode?.removeChild(list);
            list = newList;
        }
    }

    return list;
}

/**
 * Gets or creates the specified list
 */
function recurringGetOrCreateListAtNode(
    node: HTMLElement,
    level: number,
    listMetadata: ListMetadata | null
): Node {
    let parent: Node | null = null;
    let possibleList: Node | null = null;
    if (level == 1) {
        // Root case, we'll check if the list is the previous sibling of the node
        possibleList = getRealPreviousSibling(node);
    } else {
        // If we get here, we are looking for level 2 or deeper... get the upper list
        // and check if the last element is a list
        parent = recurringGetOrCreateListAtNode(node, level - 1, null);
        if (parent.lastChild) {
            possibleList = parent.lastChild;
        }
    }

    // Check the element that we got and verify that it is a list
    if (possibleList && possibleList.nodeType == NodeType.Element) {
        let tag = getTagOfNode(possibleList);
        if (tag == 'UL' || tag == 'OL') {
            // We have a list.. use it
            return possibleList;
        }
    }

    // If we get here, it means we don't have a list and we need to create one
    // this code path will always create new lists as UL lists
    let newList = node.ownerDocument?.createElement(listMetadata ? listMetadata.tagName : 'UL');
    if (level == 1) {
        // For level 1, we'll insert the list before the node
        node.parentNode?.insertBefore(newList, node);
    } else {
        // Any level 2 or above, we insert the list as the last
        // child of the upper level list
        parent?.appendChild(newList);
    }

    return newList;
}

/**
 * Cleans up the node children by removing the children marked as mso-list: Ignore.
 * This nodes hold the fake bullet information that Word puts in and when
 * conversion is happening, we want to get rid of these elements
 */
function cleanupListIgnore(node: Node, levels: number) {
    let nodesToRemove: Node[] = [];

    for (let child: Node | null = node.firstChild; child; child = child.nextSibling) {
        if (child) {
            // Clean up the item internally first if we need to based on the number of levels
            if (child && child.nodeType == NodeType.Element && levels > 1) {
                cleanupListIgnore(child, levels - 1);
            }

            // Try to convert word comments into ignore elements if we haven't done so for this element
            child = fixWordListComments(child, true /*removeComments*/);

            // Check if we can remove this item out
            if (isEmptySpan(child) || isIgnoreNode(child)) {
                nodesToRemove.push(child);
            }
        }
    }

    nodesToRemove.forEach(child => node.removeChild(child));
}

/**
 * Reads the word list meta dada out of the specified node. If the node
 * is not a Word list item, it returns null.
 */
function getListItemMetadata(node: HTMLElement): ListItemMetadata | null {
    if (node.nodeType == NodeType.Element) {
        let listAttribute = getStyleValue(node, MSO_LIST_STYLE_NAME);
        if (listAttribute && listAttribute.length > 0) {
            try {
                // Word mso-list property holds 3 space separated values in the following format: lst1 level1 lfo0
                // Where:
                // (0) List identified for the metadata in the &lt;head&gt; of the document. We cannot read the &lt;head&gt; meta data
                // (1) Level of the list. This also maps to the &lt;head&gt; metadata that we cannot read, but
                // for almost all cases, it maps to the list indentation (or level). We'll use it as the
                // list indentation value
                // (2) Contains a specific list identifier.
                // Example value: "l0 level1 lfo1"
                let listProps = listAttribute.split(' ');
                if (listProps.length == 3) {
                    return <ListItemMetadata>{
                        level: parseInt(listProps[1].substr('level'.length)),
                        wordListId: listAttribute,
                        originalNode: node,
                        uniqueListId: 0,
                    };
                }
            } catch (e) {}
        }
    }
    return null;
}

function isFakeBullet(fakeBullet: string): boolean {
    return ['o', '·', '§', '-'].indexOf(fakeBullet) >= 0;
}

/** Given a fake bullet text, returns the type of list that should be used for it */
function getFakeBulletTagName(fakeBullet: string): string {
    return isFakeBullet(fakeBullet) ? 'UL' : 'OL';
}

/**
 * Finds the fake bullet text out of the specified node and returns it. For images, it will return
 * a bullet string. If not found, it returns null...
 */
function getFakeBulletText(node: Node, levels: number): string {
    // Word uses the following format for their bullets:
    // &lt;p style="mso-list:l1 level1 lfo2"&gt;
    // &lt;span style="..."&gt;
    // &lt;span style="mso-list:Ignore"&gt;1.&lt;span style="..."&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;&lt;/span&gt;
    // &lt;/span&gt;
    // Content here...
    // &lt;/p&gt;
    //
    // Basically, we need to locate the mso-list:Ignore SPAN, which holds either one text or image node. That
    // text or image node will be the fake bullet we are looking for
    let result: string = '';
    let child: Node | null = node.firstChild;
    while (!result && child) {
        // First, check if we need to convert the Word list comments into real elements
        child = fixWordListComments(child, true /*removeComments*/);

        // Check if this is the node that holds the fake bullets (mso-list: Ignore)
        if (isIgnoreNode(child)) {
            // Yes... this is the node that holds either the text or image data
            result = child.textContent?.trim() ?? '';

            // This is the case for image case
            if (result.length == 0) {
                result = 'o';
            }
        } else if (child.nodeType == NodeType.Element && levels > 1) {
            // If this is an element and we are not in the last level, try to get the fake bullet
            // out of the child
            result = getFakeBulletText(child, levels - 1);
        }

        child = child.nextSibling;
    }

    return result;
}

/**
 * If the specified element is a Word List comments, this code verifies and fixes
 * the markup when needed to ensure that Chrome bullet conversions work as expected
 * -----
 * We'll convert &lt;!--[if !supportLists]--&gt; and &lt;!--[endif]--&gt; comments into
 * &lt;span style="mso-list:Ignore"&gt;&lt;/span&gt;... Chrome has a bug where it drops the
 * styles of the span, but we'll use these comments to recreate them out
 */
function fixWordListComments(child: Node, removeComments: boolean): Node {
    if (child.nodeType == NodeType.Comment) {
        let value = (child as Comment).data;
        if (value && value.trim().toLowerCase() == '[if !supportlists]') {
            // We have a list ignore start, find the end.. We know is not more than
            // 3 nodes away, so we'll optimize our checks
            let nextElement: Node | null = child;
            let endComment: Node | null = null;
            for (let j = 0; j < 4; j++) {
                nextElement = getRealNextSibling(nextElement);
                if (!nextElement) {
                    break;
                }
                if (nextElement.nodeType == NodeType.Comment) {
                    value = (nextElement as Comment).data;
                    if (value && value.trim().toLowerCase() == '[endif]') {
                        endComment = nextElement;
                        break;
                    }
                }
            }

            // if we found the end node, wrap everything out
            if (endComment) {
                let newSpan = child.ownerDocument?.createElement('span');
                newSpan?.setAttribute('style', 'mso-list: ignore');

                nextElement = getRealNextSibling(child);
                while (nextElement != endComment) {
                    nextElement = nextElement?.nextSibling as HTMLElement;
                    if (nextElement.previousSibling) {
                        newSpan?.appendChild(nextElement.previousSibling);
                    }
                }

                // Insert the element out and use that one as the current child
                if (newSpan) {
                    endComment.parentNode?.insertBefore(newSpan, endComment);
                }

                // Remove the comments out if the call specified it out
                if (removeComments) {
                    child.parentNode?.removeChild(child);
                    endComment.parentNode?.removeChild(endComment);
                }

                // Last, make sure we return the new element out instead of the comment
                if (newSpan) {
                    child = newSpan;
                }
            }
        }
    }

    return child;
}

/** Finds the real previous sibling, ignoring empty text nodes */
function getRealPreviousSibling(node: Node): Node | null {
    let prevSibling: Node | null = node;
    do {
        prevSibling = prevSibling.previousSibling;
    } while (prevSibling && isEmptyTextNode(prevSibling));
    return prevSibling;
}

/** Finds the real next sibling, ignoring empty text nodes */
function getRealNextSibling(node: Node): Node | null {
    let nextSibling: Node | null = node;
    do {
        nextSibling = nextSibling.nextSibling;
    } while (nextSibling && isEmptyTextNode(nextSibling));

    return nextSibling;
}

/**
 * Checks if the specified node is marked as a mso-list: Ignore. These
 * nodes need to be ignored when a list item is converted into standard
 * HTML lists
 */
function isIgnoreNode(node: Node): boolean {
    if (node.nodeType == NodeType.Element) {
        let listAttribute = getStyleValue(node as HTMLElement, MSO_LIST_STYLE_NAME);
        if (
            listAttribute &&
            listAttribute.length > 0 &&
            listAttribute.trim().toLowerCase() == 'ignore'
        ) {
            return true;
        }
    }

    return false;
}

/** Checks if the specified node is an empty span. */
function isEmptySpan(node: Node): boolean {
    return getTagOfNode(node) == 'SPAN' && !node.firstChild;
}

/** Reads the specified style value from the node */
function getStyleValue(node: HTMLElement, styleName: string): string | null {
    // Word uses non-standard names for the metadata that puts in the style of the element...
    // Most browsers will not provide the information for those nonstandard values through the node.style
    // property, so the only reliable way to read them is to get the attribute directly and do
    // the required parsing..
    return getStyles(node)[styleName] || null;
}

/** Checks if the node is an empty text node that can be ignored */
function isEmptyTextNode(node: Node): boolean {
    // No node is empty
    if (!node) {
        return true;
    }

    // Empty text node is empty
    if (node.nodeType == NodeType.Text) {
        let value = node.nodeValue;
        value = value?.replace(LINE_BREAKS, '') ?? '';
        return value?.trim().length == 0;
    }

    // Span or Font with an empty child node is empty
    let tagName = getTagOfNode(node);
    if (
        node.firstChild &&
        node.firstChild == node.lastChild &&
        (tagName == 'SPAN' || tagName == 'FONT')
    ) {
        return isEmptyTextNode(node.firstChild);
    }

    // If not found, then this is not empty
    return false;
}

/** Resets the list */
function resetCurrentLists(args: WordConverterArguments) {
    for (let i = 0; i < args.currentListIdsByLevels.length; i++) {
        let ll = args.currentListIdsByLevels[i];
        if (ll) {
            ll.currentUniqueListId = -1;
        }
    }
}
