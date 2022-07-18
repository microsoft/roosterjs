/**
 * @internal
 */
export function tempCreateAttributes(element: HTMLElement | null): Record<string, string> {
    const result: Record<string, string> = {};

    if (element) {
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            result[attr.name] = attr.value;
        }
    }

    return result;
}
