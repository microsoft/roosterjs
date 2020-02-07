export interface TargetWindow {
    Node: Node;
    HTMLElement: HTMLElement;
    HTMLOListElement: HTMLOListElement;
    HTMLTableElement: HTMLTableElement;
    HTMLTableCellElement: HTMLTableCellElement;
    Range: Range;
    DocumentFragment: DocumentFragment;
}

/**
 * Try get window from the given node or range
 * @param source Source node or range
 */
export function getTargetWindow(source: Node | Range): TargetWindow {
    const node = source && ((<Range>source).commonAncestorContainer || <Node>source);
    const document =
        node &&
        (node.ownerDocument ||
            (Object.prototype.toString.apply(node) == '[object HTMLDocument]'
                ? <Document>node
                : null));

    // If document exists but document.defaultView doesn't exist, it is a detached object, just use current window instead
    const targetWindow = document && ((document.defaultView || window) as any);
    return targetWindow as TargetWindow;
}

/**
 * Check if the given object is instance of the target type
 * @param obj Object to check
 * @param typeName Target type name
 */
export default function safeInstanceOf<T extends keyof TargetWindow>(
    obj: Node | Range,
    typeName: T
): obj is TargetWindow[T] {
    const targetWindow = getTargetWindow(obj);
    const targetType = targetWindow && (targetWindow[typeName] as any);
    return targetType && obj instanceof targetType;
}
