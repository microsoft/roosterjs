/**
 * Set styles to an HTML element. If styles are empty, remove 'style' attribute
 * @param element The element to set styles
 * @param styles The styles to set, in name-value pair format
 */
export default function setStyles(element: HTMLElement, styles: Record<string, string>) {
    if (element) {
        const style = Object.keys(styles || {})
            .map(name => {
                let value = styles[name];
                name = name ? name.trim() : null;
                value = value ? value.trim() : null;
                return name && value ? `${name}:${value}` : null;
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
