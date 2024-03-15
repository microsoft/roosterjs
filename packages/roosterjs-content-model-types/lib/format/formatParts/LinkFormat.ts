/**
 * Format of hyper link
 */
export type LinkFormat = {
    /**
     * Name of this link
     */
    name?: string;

    /**
     * Href of the hyper link
     */
    href?: string;

    /**
     * Target of the hyper link
     */
    target?: string;

    /**
     * Id of anchor element
     */
    anchorId?: string;

    /**
     * Class attribute of anchor element
     */
    anchorClass?: string;

    /**
     * Title attribute of anchor element
     */
    anchorTitle?: string;

    /**
     * Rel attribute of anchor element
     */
    relationship?: string;
};
