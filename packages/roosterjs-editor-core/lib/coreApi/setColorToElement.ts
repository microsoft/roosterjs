import { processCssVariable } from 'roosterjs-editor-dom';
import { SetColorToElement } from 'roosterjs-editor-types';

const ColorNamePrefix = '--darkColor_';

/**
 * @internal
 * Set color to an HTML Element inside editor. If editor is in dark mode, color will be adjusted according to dark mode.
 * @param core The EditorCore object
 * @param element The element to set color to
 * @param color The color to set
 * @param cssName Css property name of the color to set
 * @param isDarkMode Whether set color for dark mode. This value can be different than editor's current color mode
 */
export const setColorToElement: SetColorToElement = (core, element, color, cssName, isDarkMode) => {
    let lightColor = typeof color == 'string' ? color : color.lightModeColor;
    let colorKey: string | null = null;

    const matches = processCssVariable(lightColor);

    if (matches) {
        lightColor = matches[2];
    }

    if (lightColor) {
        const {
            lifecycle: { getDarkColor, knownDarkColorKeys },
            contentDiv,
        } = core;

        colorKey = isDarkMode ? ColorNamePrefix + lightColor.replace(/[^\d\w]/g, '_') : null;
        const colorValue = isDarkMode ? `var(${colorKey},${lightColor})` : lightColor;

        element.style.setProperty(cssName, colorValue);

        if (colorKey && !knownDarkColorKeys[colorKey]) {
            const darkColor = typeof color == 'string' ? getDarkColor(color) : color.darkModeColor;
            contentDiv.style.setProperty(colorKey, darkColor);
            knownDarkColorKeys[colorKey] = darkColor;
        }
    } else {
        element.style.removeProperty(cssName);
    }
};
