import { TargetWindow } from 'roosterjs-editor-types';

// NOTE: Type TargetWindow is an auto-generated type.
// Run node ./tools/generateTargetWindow.js to generate it.

/**
 * @internal Export for test only
 * Try get window from the given node or range
 * @param source Source node or range
 */
export function getTargetWindow<T extends TargetWindow = TargetWindow>(source: Node | Range): T {
    const node = source && ((<Range>source).commonAncestorContainer || <Node>source);
    const document =
        node &&
        (node.ownerDocument ||
            (Object.prototype.toString.apply(node) == '[object HTMLDocument]'
                ? <Document>node
                : null));

    // If document exists but document.defaultView doesn't exist, it is a detached object, just use current window instead
    const targetWindow = document && ((document.defaultView || window) as any);
    return targetWindow as T;
}

/**
 * Check if the given object is instance of the target type
 * @param obj Object to check
 * @param typeName Target type name
 */
export default function safeInstanceOf<T extends keyof W, W extends TargetWindow = TargetWindow>(
    obj: any,
    typeName: T
): obj is W[T] {
    const targetWindow = getTargetWindow<W>(obj);
    const targetType = targetWindow && (targetWindow[typeName] as any);
    const mainWindow = (window as any) as W;
    const mainWindowType = mainWindow && (mainWindow[typeName] as any);
    return (
        (mainWindowType && obj instanceof mainWindowType) ||
        (targetType && obj instanceof targetType)
    );
}
