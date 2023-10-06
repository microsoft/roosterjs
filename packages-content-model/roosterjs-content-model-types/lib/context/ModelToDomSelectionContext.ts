import type { ImageSelection, TableSelection } from '../selection/DOMSelection';

/**
 * Represents internal data structure for a selection position, combined by block and segment node
 */
export interface ModelToDomBlockAndSegmentNode {
    /**
     * The block element of the selection. When segment is null, it represents the start position of this block element,
     * otherwise block element will be ignored and we can always retrieve position from segment node
     */
    block: Node | null;

    /**
     * Segment node of this position. When provided, it represents the position right after this node
     */
    segment: Node | null;
}

/**
 * Represents internal data structure for regular selection
 */
export interface ModelToDomRegularSelection {
    /**
     * Start position of selection
     */
    start?: ModelToDomBlockAndSegmentNode;

    /**
     * End position of selection
     */
    end?: ModelToDomBlockAndSegmentNode;

    /**
     * Current navigating position
     */
    current: ModelToDomBlockAndSegmentNode;
}

/**
 * Represents selection info used by Content Model to DOM conversion
 */
export interface ModelToDomSelectionContext {
    /**
     * Regular selection info
     */
    regularSelection: ModelToDomRegularSelection;

    /**
     * Table selection info
     */
    tableSelection?: TableSelection;

    /**
     * Image selection info
     */
    imageSelection?: ImageSelection;
}
