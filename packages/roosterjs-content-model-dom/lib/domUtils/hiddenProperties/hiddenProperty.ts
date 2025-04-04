/**
 * @internal
 */
export interface HiddenProperty {
    /**
     * A marker string that can be used to identify a specific paragraph in the DOM.
     * This is useful for scenarios where you need to track or manipulate specific paragraphs
     */
    paragraphMarker?: string;

    /**
     * Specify we should not delete this element when delete/backspace key is pressed
     */
    undeletable?: boolean;

    // Add more properties as needed
}

interface NodeWithHiddenProperty extends Node {
    __roosterjsHiddenProperty?: HiddenProperty;
}

/**
 * @internal
 */
export function getHiddenProperty<Key extends keyof HiddenProperty>(
    node: Node,
    key: Key
): HiddenProperty[Key] | undefined {
    const nodeWithHiddenProperty = node as NodeWithHiddenProperty;
    const hiddenProperty = nodeWithHiddenProperty.__roosterjsHiddenProperty;

    return hiddenProperty ? hiddenProperty[key] : undefined;
}

/**
 * @internal
 */
export function setHiddenProperty<Key extends keyof HiddenProperty>(
    node: Node,
    key: Key,
    value: HiddenProperty[Key]
) {
    const nodeWithHiddenProperty = node as NodeWithHiddenProperty;
    const hiddenProperty = nodeWithHiddenProperty.__roosterjsHiddenProperty || {};

    hiddenProperty[key] = value;
    nodeWithHiddenProperty.__roosterjsHiddenProperty = hiddenProperty;
}
