import { DarkColorHandler, DarkModeDatasetNames } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function getColor(
    element: HTMLElement,
    isBackground: boolean,
    darkColorHandler: DarkColorHandler | undefined | null,
    isDarkMode: boolean
): string | undefined {
    let color: string | undefined;
    if (isDarkMode && !darkColorHandler) {
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

    if (darkColorHandler) {
        color = darkColorHandler.parseColorValue(color).lightModeColor;
    }

    return color;
}

/**
 * @internal
 */
export function setColor(
    element: HTMLElement,
    lightModeColor: string,
    isBackground: boolean,
    darkColorHandler: DarkColorHandler | undefined | null,
    isDarkMode: boolean,
    getDarkColor?: (color: string) => string
) {
    let effectiveColor: string;

    if (isDarkMode && originalColor) {
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
