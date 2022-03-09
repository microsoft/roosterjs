import adaptFontColorToBackgroundColor from './adaptFontColorToBackgroundColor';
import { DarkModeDatasetNames, ModeIndependentColor } from 'roosterjs-editor-types';

/**
 * Set text color or background color to the given element
 * @param element The element to set color to
 * @param color The color to set, it can be a string of color name/value or a ModeIndependentColor object
 * @param isBackgroundColor Whether set background color or text color
 * @param isDarkMode Whether current mode is dark mode. @default false
 */
export default function setColor(
    element: HTMLElement,
    color: string | ModeIndependentColor,
    isBackgroundColor: boolean,
    isDarkMode?: boolean,
    shouldAdaptTheFontColor?: boolean
) {
    const colorString = typeof color === 'string' ? color.trim() : '';
    const modeIndependentColor = typeof color === 'string' ? null : color;

    if (colorString || modeIndependentColor) {
        const newColor = isDarkMode
            ? modeIndependentColor?.darkModeColor
            : modeIndependentColor?.lightModeColor;
        element.style.setProperty(
            isBackgroundColor ? 'background-color' : 'color',
            newColor || colorString
        );
        if (isBackgroundColor && shouldAdaptTheFontColor) {
            adaptFontColorToBackgroundColor(element, newColor || colorString);
        }
        if (element.dataset) {
            const dataSetName = isBackgroundColor
                ? DarkModeDatasetNames.OriginalStyleBackgroundColor
                : DarkModeDatasetNames.OriginalStyleColor;
            if (!isDarkMode) {
                delete element.dataset[dataSetName];
            } else if (modeIndependentColor) {
                element.dataset[dataSetName] = modeIndependentColor.lightModeColor;
            }
        }
    }
}
