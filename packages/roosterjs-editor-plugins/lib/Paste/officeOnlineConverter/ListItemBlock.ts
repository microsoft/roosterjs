/**
 * Type that holds all the info of a consecutive list item block.
 */
export default interface ListItemBlock {
    /**
     * The first element in block of list item from pasted word online document.
     */
    startElement: Element;

    /**
     * The last element in block of list item from pasted word online document.
     */
    endElement: Element;

    /**
     * The position where the processed bulleted list should be inserted.
     */
    insertPositionNode: Node;

    /**
     * The list of containers that wraps each list item.
     */
    listItemContainers: Element[];
}

/**
 * Initialize an empty ListItemBlock
 */
export function createListItemBlock(listItem: Element = null): ListItemBlock {
    return {
        startElement: listItem,
        endElement: listItem,
        insertPositionNode: null,
        listItemContainers: listItem ? [listItem] : [],
    };
}
