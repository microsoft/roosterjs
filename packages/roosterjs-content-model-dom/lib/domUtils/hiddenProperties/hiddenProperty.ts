/**
 * @internal
 */
export interface HiddenProperty {
    /**
     * Specify we should not delete this element when delete/backspace key is pressed
     */
    undeletable?: boolean;
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
