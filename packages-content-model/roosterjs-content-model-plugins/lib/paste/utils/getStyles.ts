/**
 * @internal
 * Get CSS styles of a given element in name-value pair format
 * @param element The element to get styles from
 */
export function getStyles(element: HTMLElement): Record<string, string> {
    const result: Record<string, string> = {};
    const style = element?.getAttribute('style') || '';
    style.split(';').forEach(pair => {
        const valueIndex = pair.indexOf(':');
        const name = pair.slice(0, valueIndex);
        const value = pair.slice(valueIndex + 1);
        if (name && value) {
            result[name.trim()] = value.trim();
        }
    });
    return result;
}
