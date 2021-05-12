import * as Color from 'color';
import { DarkModeDatasetNames } from 'roosterjs-editor-types';

const baseBGColor = Color('#333333');

export default function fixColor(element: HTMLElement) {
    try {
        const computedStyles = window.getComputedStyle(element);

        const styleColor = element.style.color;
        let textColor = Color(computedStyles.color || undefined);
        let attrColor = element.getAttribute('color');
        let hasDarkColor =
            element.dataset[DarkModeDatasetNames.OriginalStyleColor] ||
            element.dataset[DarkModeDatasetNames.OriginalAttributeColor];

        if (!hasDarkColor && (styleColor || attrColor)) {
            textColor = fixContrast(textColor);

            element.style.color = textColor.rgb().string() + '!important';
            element.dataset[DarkModeDatasetNames.OriginalStyleColor] = styleColor || '';

            if (attrColor) {
                element.setAttribute('color', textColor.rgb().string());
                element.dataset[DarkModeDatasetNames.OriginalAttributeColor] = attrColor;
            }
        }

        const styleBGColor = element.style.backgroundColor;
        let bgColor = computedStyles.backgroundColor
            ? Color(computedStyles.backgroundColor)
            : Color(styleBGColor || undefined);
        let attrBGColor = element.getAttribute('bgcolor');
        let hasDarkBackgroundColor =
            element.dataset[DarkModeDatasetNames.OriginalStyleBackgroundColor] ||
            element.dataset[DarkModeDatasetNames.OriginalAttributeBackgroundColor];

        if (!hasDarkBackgroundColor && (styleBGColor || attrBGColor)) {
            bgColor = fixContrast(bgColor);

            element.style.setProperty('background-color', bgColor.rgb().string(), 'important');
            element.dataset[DarkModeDatasetNames.OriginalStyleBackgroundColor] = styleBGColor || '';

            if (attrBGColor) {
                element.setAttribute('bgcolor', bgColor.rgb().string());
                element.dataset[
                    DarkModeDatasetNames.OriginalAttributeBackgroundColor
                ] = attrBGColor;
            }
        }
    } catch {}
}

function fixContrast(color: Color): Color {
    const baseLValue = baseBGColor.lab().array()[0];
    const colorLab = color.lab().array();
    const newLValue = (100 - colorLab[0]) * ((100 - baseLValue) / 100) + baseLValue;

    return Color.lab(newLValue, colorLab[1], colorLab[2]).rgb().alpha(color.alpha());
}
