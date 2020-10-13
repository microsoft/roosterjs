/**
 * Represents a DOM region.
 * A region is a range under a given node, and possibly after one child and before another child
 * e.g.
 * ```html
 * <div>
 *   <table>...</table>
 *   <span>...</span>
 *   <span>...</span>
 *   <table>...</table>
 * <div>
 * ```
 * We can define a region under DIV before the second TABLE and after the first TABLE
 *
 * This is used when user's selection go across different TD elements or start from TD and end after
 * that TD (or inverse way). Some block operation should not ruin the TABLE structure, so we need to
 * split the selection into several regions.
 */
export default interface RegionBase {
    /**
     * Root node of this region
     */
    rootNode: HTMLElement;

    /**
     * A node to define the beginning boundary of this region.
     * All nodes after this node before nodeAfter and contaiend by rootNode will be treated contained by this region.
     */
    nodeBefore?: Node;

    /**
     * A node to define the ending boundary of this region.
     * All nodes before this node after nodeBefore and contaiend by rootNode will be treated contained by this region.
     */
    nodeAfter?: Node;

    /**
     * Tags that child elements will be skipped
     */
    skipTags: string[];
}
