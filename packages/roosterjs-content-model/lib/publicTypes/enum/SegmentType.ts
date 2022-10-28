/**
 * Type of Segment in Content Model
 */
export type ContentModelSegmentType =
    /**
     * Represents a text node
     */
    | 'Text'

    /**
     * Represents a BR element
     */
    | 'Br'

    /**
     * Represents an IMG element
     */
    | 'Image'

    /**
     * Represents a selection marker. A selection marker is an empty segment that mark the start/end of selection
     */
    | 'SelectionMarker'

    /**
     * Represents a general segment that doesn't have a special type
     */
    | 'General'

    /**
     * Represents an inline entity
     */
    | 'Entity';
