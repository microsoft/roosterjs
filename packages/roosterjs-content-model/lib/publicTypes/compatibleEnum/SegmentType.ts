/**
 * Type of Segment in Content Model
 */
export enum CompatibleContentModelSegmentType {
    /**
     * Represents a text node
     */
    Text,

    /**
     * Represents a BR element
     */
    Br,

    /**
     * Represents a selection marker. A selection marker is an empty segment that mark the start/end of selection
     */
    SelectionMarker,

    /**
     * Represents a general segment that doesn't have a special type
     */
    General,
}
