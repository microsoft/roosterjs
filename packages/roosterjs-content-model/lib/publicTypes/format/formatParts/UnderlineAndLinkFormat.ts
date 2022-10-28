/**
 * Format of underline
 */
export type UnderlineAndLinkFormat = {
    /**
     * Whether it has underline
     */
    underline?: boolean;

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
