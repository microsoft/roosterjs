import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

const WORD_ONLINE_IDENTIFYING_SELECTOR = "div.ListContainerWrapper,div.OutlineElement";

const LIST_CONTAINER_ELEMENT_CLASS_NAME = "ListContainerWrapper";

const UNORDERED_LIST_TAG_NAME = "UL";

const ORDERED_LIST_TAG_NAME = "OL";

export function isWAC(node: HTMLElement): boolean {
    if (node) {
        return node.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR) ? true : false;
    }
    return false;
}

/**
 * Convert text copied from word online into text that's workable with rooster editor
 * @param doc Document that is being pasted into editor.
 */
export default function convertPastedContentFromWac(doc: HTMLDocument) {
    // From word online rows are wrapped with OutlineGroup class, which
    // makes each row not direct siblings. For the ease of converting,
    // the following code flatens the row elements and make them direct
    // siblings.
    const wrapperElement = document.createElement('div');
    let el = doc.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR);
    while (el) {
        el.parentElement.removeChild(el);
        wrapperElement.appendChild(el);
        el = doc.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR);
    }

    // In word online list items are wrapped in a container
    // and adjacent list items are belong to the same list.
    // In the following comments we will call a block of adjacent
    // list items a list item block.

    // Get the first element of a list item block.
    let listContainerElement = wrapperElement.getElementsByClassName(LIST_CONTAINER_ELEMENT_CLASS_NAME)[0];
    while (listContainerElement) {
        let convertedListElement: Element; // Element that store converted list item in current list item block.
        let currentListContainer = listContainerElement; // Iterator that iterate through each list item in the current block.
        let listContainerParent = currentListContainer.parentElement; // Parent element of current list item block.
        // if the iterator exists and the iterator still contains list then perceed with loop.
        while (currentListContainer && currentListContainer.classList.contains(LIST_CONTAINER_ELEMENT_CLASS_NAME)) {
            let listType: string; // list type that is contained by iterator.

            if (currentListContainer.querySelector(UNORDERED_LIST_TAG_NAME)) {
                listType = 'UL';
            } else if (currentListContainer.querySelector(ORDERED_LIST_TAG_NAME)) {
                listType = 'OL'
            }

            // Initialize processed element with propery listType if the
            if (!convertedListElement) {
                convertedListElement = document.createElement(listType);
            }

            // Get all list items(<li>) in the current iterator element.
            const currentListItems = currentListContainer.querySelectorAll('li');
            currentListItems.forEach((item) => {
                // Get item level from 'data-aria-level' attribute
                let itemLevel = parseInt(item.getAttribute('data-aria-level'));
                let curListLevel = convertedListElement; // Level iterator to find the correct place for the current element.
                // Word only uses margin to indent and hide list-style(bullet point)
                // So we need to remove the style from the list item.
                item.removeAttribute('style');
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
                curListLevel.appendChild(item);
            })

            let nextContainer = currentListContainer.nextElementSibling; // Get the next sibling.
            currentListContainer.parentElement.removeChild(currentListContainer); // Remove the current list item
            currentListContainer = nextContainer; // Increment iterator.
        }

        if (currentListContainer) {
            // If the iterator exist, it means that the iterator is not a list item anymore and
            // the list exist before the itertor element. Then insert the list element before
            // iterator
            listContainerParent.insertBefore(convertedListElement, currentListContainer);
        } else {
            // If the iterator doesn't exist, it means that the list element is the last element
            // of the parent, so simply append list element into the parent.
            listContainerParent.appendChild(convertedListElement);
        }

        // After previous code finish executing,
        listContainerElement = wrapperElement.getElementsByClassName(LIST_CONTAINER_ELEMENT_CLASS_NAME)[0];
    }

    doc.body.innerHTML = wrapperElement.innerHTML

    let sanitizer = new HtmlSanitizer({
        elementCallbacks: {
            ['O:P']: () => false,
        },
        additionalAllowAttributes: ['class'],
    });
    sanitizer.sanitize(doc.body);
}
