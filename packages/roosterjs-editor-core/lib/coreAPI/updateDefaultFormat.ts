import EditorCore, { UpdateDefaultFormat } from '../interfaces/EditorCore';
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
 * Calculate default format of the given editoreditor
 * @param core The editor core object
 */
export const updateDefaultFormat: UpdateDefaultFormat = (core: EditorCore) => {
    const isDarkMode = core.darkMode.value.isDarkMode;
    let baseFormat = core.defaultFormat;
    if (isDarkMode) {
        if (!baseFormat.backgroundColors) {
            baseFormat.backgroundColors = DARK_MODE_DEFAULT_FORMAT.backgroundColors;
        }
        if (!baseFormat.textColors) {
            baseFormat.textColors = DARK_MODE_DEFAULT_FORMAT.textColors;
        }
    }

    if (baseFormat && Object.keys(baseFormat).length === 0) {
        return {};
    }

    baseFormat = baseFormat || <DefaultFormat>{};
    let {
        fontFamily,
        fontSize,
        textColor,
        textColors,
        backgroundColor,
        backgroundColors,
        bold,
        italic,
        underline,
    } = baseFormat;
    let currentStyles =
        fontFamily && fontSize && (textColor || textColors)
            ? null
            : getComputedStyles(core.contentDiv);
    core.defaultFormat = {
        fontFamily: fontFamily || currentStyles[0],
        fontSize: fontSize || currentStyles[1],
        get textColor() {
            return textColors
                ? isDarkMode
                    ? textColors.darkModeColor
                    : textColors.lightModeColor
                : textColor || currentStyles[2];
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
