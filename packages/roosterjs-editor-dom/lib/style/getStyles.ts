/**
 * Get CSS styles of a given element in name-value pair format
 * @param element The element to get styles from
 */
export default function getStyles(element: HTMLElement): Record<string, string> {
    const result: Record<string, string> = {};
    const style = element?.getAttribute('style') || '';
    style.split(';').forEach(pair => {
        const [name, value] = pair.split(':');
        if (name && value) {
            result[name.trim()] = value.trim();
        }
    });
    return result;
}
