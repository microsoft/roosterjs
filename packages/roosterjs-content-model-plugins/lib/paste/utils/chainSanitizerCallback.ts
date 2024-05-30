import type { ValueSanitizer } from 'roosterjs-content-model-types';

/**
 * @internal
 * Chain all callback for an style sanitizer
 * @param map The source callback map
 * @param name Name of the property to chain
 * @param newCallback A new callback to process the given name on the given map.
 */
export function chainSanitizerCallback(
    map: Record<string, ValueSanitizer>,
    name: string,
    newCallback: ValueSanitizer
) {
    const finalCb =
        typeof newCallback == 'function'
            ? newCallback
            : (value: string) => (newCallback ? value : null);
    if (!map[name]) {
        map[name] = finalCb;
    } else {
        const originalCallback = map[name];
        map[name] = (value: string, tagName: string) => {
            const og =
                typeof originalCallback == 'function'
                    ? originalCallback(value, tagName)
                    : originalCallback
                    ? value
                    : false;
            if (!og) {
                return null;
            } else {
                return finalCb(og, tagName);
            }
        };
    }
}
