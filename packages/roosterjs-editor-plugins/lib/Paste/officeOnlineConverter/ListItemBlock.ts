export default interface ListItemBlock {
    startElement: Element;
    endElement: Element;
    insertPositionElement: Element;
    listItemContainers: Element[];
}

export function createListItemBlock(listItem: Element = null): ListItemBlock {
    return {
        startElement: listItem,
        endElement: listItem,
        insertPositionElement: null,
        listItemContainers: listItem ? [listItem] : [],
    }
}