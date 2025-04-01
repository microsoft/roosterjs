/**
 * Options for HiddenProperty plugin
 */
export interface HiddenPropertyOptions {
    /**
     * A helper function to check if a link should be undeletable or not.
     * @param link The link to check
     * @returns True if the link should be undeletable, false otherwise
     */
    undeletableLinkChecker?: (link: HTMLAnchorElement) => boolean;
}
