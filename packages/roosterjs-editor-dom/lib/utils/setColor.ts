import safeInstanceOf from '../utils/safeInstanceOf';
import { DarkModeDatasetNames, ModeIndependentColor } from 'roosterjs-editor-types';

export default function setColor(
    element: HTMLElement,
    color: string | ModeIndependentColor,
    isBackgroundColor: boolean,
    isDarkMode?: boolean
) {
    if (safeInstanceOf(element.parentNode, 'HTMLAnchorElement')) {
        return;
    }
    const colorString = typeof color === 'string' ? color.trim() : '';
    const modeIndependentColor = typeof color === 'string' ? null : color;

    if (colorString || modeIndependentColor) {
        element.style.setProperty(
            isBackgroundColor ? 'background-color' : 'color',
            (isDarkMode
                ? modeIndependentColor?.darkModeColor
                : modeIndependentColor?.lightModeColor) || colorString
        );

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
