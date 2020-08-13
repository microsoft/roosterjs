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
    let baseFormat = core.lifecycle.value.defaultFormat;
    const inDarkMode = core.darkMode.value.isDarkMode;

    if (inDarkMode && baseFormat) {
        if (!baseFormat.backgroundColors) {
            baseFormat.backgroundColors = DARK_MODE_DEFAULT_FORMAT.backgroundColors;
        }
        if (!baseFormat.textColors) {
            baseFormat.textColors = DARK_MODE_DEFAULT_FORMAT.textColors;
        }
    }

    if (baseFormat && Object.keys(baseFormat).length === 0) {
        return;
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
    } = baseFormat || <DefaultFormat>{};
    const currentStyles = getComputedStyles(core.contentDiv);
    core.lifecycle.value.defaultFormat = {
        fontFamily: fontFamily || currentStyles[0],
        fontSize: fontSize || currentStyles[1],
        get textColor() {
            return textColors
                ? inDarkMode
                    ? textColors.darkModeColor
                    : textColors.lightModeColor
                : textColor || currentStyles[2];
        },
        textColors: textColors,
        get backgroundColor() {
            return backgroundColors
                ? inDarkMode
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
