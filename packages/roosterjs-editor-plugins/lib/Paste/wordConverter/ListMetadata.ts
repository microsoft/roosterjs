/** Holds the metadata of a particular list */
export default interface ListMetadata {
    /** Holds the unique list id for this list */
    uniqueListId: number;

    /** Tag to be used when converting this list */
    tagName: string;

    /**
     * Stores the value of the first fake bullet of the list. We'll
     * use this to decide if we need a UL or OL when the second item
     * shows up
     */
    firstFakeBullet: string;

    /** This flag is set to true if we need to ignore this list */
    ignore: boolean;

    /** Counts the number of items we have found for this list */
    numberOfItems: number;
}
