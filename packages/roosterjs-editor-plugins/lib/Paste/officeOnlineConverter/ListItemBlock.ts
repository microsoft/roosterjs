/**
 * Type that holds all the info of a consecutive list item block.
 */
export default interface ListItemBlock {
    startElement: Element;
    endElement: Element;
    insertPositionNode: Node;
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
    }
}