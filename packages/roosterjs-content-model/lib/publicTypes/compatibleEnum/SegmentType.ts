/**
 * Type of Segment in Content Model
 *
 * (This is a temporary file, later we will delete it and let build script generate it instead)
 */
export enum CompatibleContentModelSegmentType {
    /**
     * Represents a text node
     */
    Text,

    /**
     * Represents a selection marker. A selection marker is an empty segment that mark the start/end of selection
     */
    SelectionMarker,

    /**
     * Represents a general segment that doesn't have a special type
     */
    General,
}
