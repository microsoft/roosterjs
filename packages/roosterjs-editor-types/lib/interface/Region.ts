import type NodePosition from './NodePosition';
import type RegionBase from './RegionBase';

/**
 * Represents a DOM region with selection information
 * For more info about Region, see RegionBase
 */
export default interface Region extends RegionBase {
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
