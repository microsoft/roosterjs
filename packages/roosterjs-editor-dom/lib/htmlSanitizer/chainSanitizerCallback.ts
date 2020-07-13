/**
 * Chain all callback for an attribute together
 * @param map The source callback map
 * @param name Name of the property to chain
 * @param newCallback A new callback to process the given name on the given map.
 * If the same property got multiple callbacks, the final return value will be the return
 * value of the latest callback
 */
export default function chainSanitizerCallback<T extends any[], R>(
    map: Record<string, (...args: T) => R>,
    name: string,
    newCallback: (...args: T) => R
) {
    if (!map[name]) {
        map[name] = newCallback;
    } else {
        const originalCallback = map[name];
        map[name] = (...args: T) => {
            originalCallback(...args);
            return newCallback(...args);
        };
    }
}
