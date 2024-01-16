/**
 * Format of list / list item that stored as metadata
 */
export type ListMetadataFormat = {
    /**
     * Style type for Ordered list. Use value of constant NumberingListType as value.
     */
    orderedStyleType?: number;

    /**
     * Style type for Unordered list. Use value of constant BulletListType as value.
     */
    unorderedStyleType?: number;
};
