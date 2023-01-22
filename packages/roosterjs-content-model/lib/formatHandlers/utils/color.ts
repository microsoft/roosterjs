import { createCssVariable, createCssVariableKey, processCssVariable } from 'roosterjs-editor-dom';

const ColorNamePrefix = 'darkColor_';

/**
 * @internal
 */
export function getColor(element: HTMLElement, isBackground: boolean): string | undefined {
    const color =
        element.style.getPropertyValue(isBackground ? 'background-color' : 'color') ||
        element.getAttribute(isBackground ? 'bgcolor' : 'color');
    const match = color ? processCssVariable(color) : null;

    return (match ? match[2] : color) || undefined;
}

/**
 * @internal
 */
export function setColor(
    element: HTMLElement,
    color: string,
    isBackground: boolean,
    isDarkMode: boolean,
    newDarkColors: Record<string, string>
) {
    if (isDarkMode && color) {
        const colorKey = createCssVariableKey(color, ColorNamePrefix);

        newDarkColors[colorKey] = color;
        color = createCssVariable(colorKey, color);
    }

    if (color) {
        element.style.setProperty(isBackground ? 'background-color' : 'color', color);
    }
}
