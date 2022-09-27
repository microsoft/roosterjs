import { BulletListType, NumberingListType } from 'roosterjs-editor-types';

/**
 * Format of list / list item that stored as metadata
 */
export type ListMetadataFormat = {
    /**
     * Style type for Ordered list
     */
    orderedStyleType?: NumberingListType;

    /**
     * Style type for Unordered list
     */
    unorderedStyleType?: BulletListType;
};
