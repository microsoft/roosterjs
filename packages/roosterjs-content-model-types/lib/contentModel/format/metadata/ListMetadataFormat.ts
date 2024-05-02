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

    /**
     * When set to true, if there is no orderedStyleType (for OL) or unorderedStyleType (for UL) specified, use the list from its level
     * For ordered list, the default list styles from levels are: 'decimal', 'lower-alpha', 'lower-roman', then loop
     * For unordered list, the default list styles from levels are: 'disc', 'circle', 'square', then loop
     */
    applyListStyleFromLevel?: boolean;
};
