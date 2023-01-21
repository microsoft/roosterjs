import { contains, getComputedStyles, processCssVariable } from 'roosterjs-editor-dom';
import {
    EditorCore,
    GetStyleBasedFormatState,
    ModeIndependentColor,
    NodeType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Get style based format state from current selection, including font name/size and colors
 * @param core The EditorCore objects
 * @param node The node to get style from
 */
export const getStyleBasedFormatState: GetStyleBasedFormatState = (
    core: EditorCore,
    node: Node | null
) => {
    if (!node) {
        return {};
    }

    let override: string[] = [];
    const pendableFormatSpan = core.pendingFormatState.pendableFormatSpan;

    if (pendableFormatSpan) {
        override = [
            pendableFormatSpan.style.fontFamily,
            pendableFormatSpan.style.fontSize,
            pendableFormatSpan.style.color,
            pendableFormatSpan.style.backgroundColor,
        ];
    }

    const styles = node ? getComputedStyles(node, ['font-family', 'font-size']) : [];

    if (core.lifecycle.isDarkMode) {
        while (node && contains(core.contentDiv, node) && !(styles[2] && styles[3])) {
            if (node.nodeType == NodeType.Element) {
                const element = node as HTMLElement;

                styles[2] = styles[2] || element.style.getPropertyValue('color');
                styles[3] = styles[3] || element.style.getPropertyValue('background-color');
            }
            node = node.parentNode;
        }
    }

    const textColor = processColorVariable(core, override[2] || styles[2]);
    const backColor = processColorVariable(core, override[3] || styles[3]);
    const isDarkMode = core.lifecycle.isDarkMode;

    return {
        fontName: override[0] || styles[0],
        fontSize: override[1] || styles[1],
        textColor:
            isDarkMode && textColor.darkModeColor
                ? textColor.darkModeColor
                : textColor.lightModeColor,
        backgroundColor:
            isDarkMode && backColor.darkModeColor
                ? backColor.darkModeColor
                : backColor.lightModeColor,
        textColors: textColor.lightModeColor && textColor.darkModeColor ? textColor : undefined,
        backgroundColors:
            backColor.lightModeColor && backColor.darkModeColor ? backColor : undefined,
    };
};

function processColorVariable(core: EditorCore, input: string): ModeIndependentColor {
    const match = processCssVariable(input);

    if (match) {
        const darkColor = core.lifecycle.knownDarkColors[match[1]];
        const lightColor = match[2];

        return {
            lightModeColor: lightColor,
            darkModeColor: darkColor,
        };
    } else {
        return {
            lightModeColor: input,
            darkModeColor: '',
        };
    }
}
