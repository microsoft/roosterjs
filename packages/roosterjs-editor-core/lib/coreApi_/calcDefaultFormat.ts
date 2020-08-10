import EditorCore, { CalcDefaultFormat } from '../interfaces/EditorCore';
import { DefaultFormat } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';

const DARK_MODE_DEFAULT_FORMAT = {
    backgroundColors: {
        darkModeColor: 'rgb(51,51,51)',
        lightModeColor: 'rgb(255,255,255)',
    },
    textColors: {
        darkModeColor: 'rgb(255,255,255)',
        lightModeColor: 'rgb(0,0,0)',
    },
};

/**
 * Calculate default format of editor
 * @param core The EditorCore object
 */
export const calcDefaultFormat: CalcDefaultFormat = (core: EditorCore) => {
    let currentValue = core.lifecycle.value.defaultFormat;
    const isDarkMode = core.darkMode.value.isDarkMode;

    if (currentValue && Object.keys(currentValue).length === 0) {
        return;
    }

    if (isDarkMode && currentValue) {
        if (!currentValue.backgroundColors) {
            currentValue.backgroundColors = DARK_MODE_DEFAULT_FORMAT.backgroundColors;
        }
        if (!currentValue.textColors) {
            currentValue.textColors = DARK_MODE_DEFAULT_FORMAT.textColors;
        }
    }

    const {
        fontFamily,
        fontSize,
        textColor,
        textColors,
        backgroundColor,
        backgroundColors,
        bold,
        italic,
        underline,
    } = currentValue || <DefaultFormat>{};
    const originalStyle = getComputedStyles(core.contentDiv);
    core.lifecycle.value.defaultFormat = {
        fontFamily: fontFamily || originalStyle[0],
        fontSize: fontSize || originalStyle[1],
        get textColor() {
            return textColors
                ? isDarkMode
                    ? textColors.darkModeColor
                    : textColors.lightModeColor
                : textColor || originalStyle[2];
        },
        textColors: textColors,
        get backgroundColor() {
            return backgroundColors
                ? isDarkMode
                    ? backgroundColors.darkModeColor
                    : backgroundColors.lightModeColor
                : backgroundColor || '';
        },
        backgroundColors: backgroundColors,
        bold: bold,
        italic: italic,
        underline: underline,
    };
};
