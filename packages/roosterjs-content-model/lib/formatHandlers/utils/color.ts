import { DarkModeDatasetNames, ModeIndependentColor } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    isDarkMode: boolean
): string | undefined {
    let color: string | undefined;
    if (isDarkMode) {
        color =
            element.dataset[
                isBackground
                    ? DarkModeDatasetNames.OriginalStyleBackgroundColor
                    : DarkModeDatasetNames.OriginalStyleColor
            ] ||
            element.dataset[
                isBackground
                    ? DarkModeDatasetNames.OriginalAttributeBackgroundColor
                    : DarkModeDatasetNames.OriginalAttributeColor
            ];
    }

    if (!color) {
        color =
            (isBackground ? element.style.backgroundColor : element.style.color) ||
            element.getAttribute(isBackground ? 'bgcolor' : 'color') ||
            undefined;
    }

    return color;
}

export function setColor(
    element: HTMLElement,
    color: string | ModeIndependentColor,
    isBackground: boolean,
    isDarkMode: boolean,
    getDarkColor?: (color: string) => string
) {
    const originalColor = typeof color === 'object' ? color.lightModeColor : color;
    const effectiveColor = isDarkMode
        ? typeof color === 'object'
            ? color.darkModeColor
            : getDarkColor?.(color) || color
        : originalColor;

    if (isDarkMode) {
        element.dataset[
            isBackground
                ? DarkModeDatasetNames.OriginalStyleBackgroundColor
                : DarkModeDatasetNames.OriginalStyleColor
        ] = originalColor;
    }

    if (isBackground) {
        element.style.backgroundColor = effectiveColor;
    } else {
        element.style.color = effectiveColor;
    }
}
