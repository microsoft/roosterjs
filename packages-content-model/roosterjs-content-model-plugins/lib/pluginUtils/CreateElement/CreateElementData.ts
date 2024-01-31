/**
 * An interface represents the data for creating element used by createElement()
 */
export default interface CreateElementData {
    /**
     * Tag name of this element.
     * It can be just a tag, or in format "namespace:tag"
     */
    tag: string;

    /**
     * Namespace of this tag
     */
    namespace?: string;

    /**
     * CSS class name
     */
    className?: string;

    /**
     * CSS style
     */
    style?: string;

    /**
     * Dataset of this element
     */
    dataset?: Record<string, string>;

    /**
     * Additional attributes of this element
     */
    attributes?: Record<string, string>;

    /**
     * Child nodes of this element, can be another CreateElementData, or a string which represents a text node
     */
    children?: (CreateElementData | string)[];
}
