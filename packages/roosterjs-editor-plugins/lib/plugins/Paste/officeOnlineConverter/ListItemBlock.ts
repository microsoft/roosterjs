/**
 * @internal
 * Type that holds all the info of a consecutive list item block.
 */
export default interface ListItemBlock {
    /**
     * The first element in block of list item from pasted word online document.
     */
    startElement: Element | null;

    /**
     * The last element in block of list item from pasted word online document.
     */
    endElement: Element | null;

    /**
     * The position where the processed bulleted list should be inserted.
     */
    insertPositionNode: Node | null;

    /**
     * The list of containers that wraps each list item.
     */
    listItemContainers: Element[];
}

/**
 * @internal
 * Initialize an empty ListItemBlock
 */
export function createListItemBlock(listItem: Element | null = null): ListItemBlock {
    return {
        startElement: listItem,
        endElement: listItem,
        insertPositionNode: null,
        listItemContainers: listItem ? [listItem] : [],
    };
}
