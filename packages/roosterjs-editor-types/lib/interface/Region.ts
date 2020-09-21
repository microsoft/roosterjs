import NodePosition from './NodePosition';
import RegionBase from './RegionBase';

/**
 * Represents a DOM region with selection information
 * For more info about Region, see RegionBase
 */
export default interface Region extends RegionBase {
    /**
     * Tags that child elements will be skipped
     */
    skipTags: string[];

    /**
     * Start position of full selection. It is possible to be out of this region.
     * We use this position and fullSelectionEnd to calculate the selected range inside this region.
     */
    fullSelectionStart: NodePosition;

    /**
     * End position of full selection. It is possible to be out of this region.
     * We use this position and fullSelectionStart to calculate the selected range inside this region.
     */
    fullSelectionEnd: NodePosition;
}
