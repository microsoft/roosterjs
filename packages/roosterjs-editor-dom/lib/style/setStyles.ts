import getObjectKeys from '../jsUtils/getObjectKeys';

/**
 * Set styles to an HTML element. If styles are empty, remove 'style' attribute
 * @param element The element to set styles
 * @param styles The styles to set, in name-value pair format
 */
export default function setStyles(element: HTMLElement, styles: Record<string, string>) {
    if (element) {
        const style = getObjectKeys(styles || {})
            .map(name => {
                const value: string | null = styles[name];
                const trimmedName = name ? name.trim() : null;
                const trimmedValue = value ? value.trim() : null;
                return trimmedName && trimmedValue ? `${trimmedName}:${trimmedValue}` : null;
            })
            .filter(x => x)
            .join(';');
        if (style) {
            element.setAttribute('style', style);
        } else {
            element.removeAttribute('style');
        }
    }
}
