import { contains, getComputedStyles } from 'roosterjs-editor-dom';
import { NodeType } from 'roosterjs-editor-types';
import type { GetStyleBasedFormatState } from '../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Get style based format state from current selection, including font name/size and colors
 * @param core The StandaloneEditorCore objects
 * @param node The node to get style from
 */
export const getStyleBasedFormatState: GetStyleBasedFormatState = (core, node) => {
    if (!node) {
        return {};
    }

    const styles = node
        ? getComputedStyles(node, [
              'font-family',
              'font-size',
              'color',
              'background-color',
              'line-height',
              'margin-top',
              'margin-bottom',
              'text-align',
              'direction',
              'font-weight',
          ])
        : [];
    const { contentDiv, darkColorHandler, lifecycle } = core.standaloneEditorCore;

    let styleTextColor: string | undefined;
    let styleBackColor: string | undefined;

    while (
        node &&
        contains(contentDiv, node, true /*treatSameNodeAsContain*/) &&
        !(styleTextColor && styleBackColor)
    ) {
        if (node.nodeType == NodeType.Element) {
            const element = node as HTMLElement;

            styleTextColor = styleTextColor || element.style.getPropertyValue('color');
            styleBackColor = styleBackColor || element.style.getPropertyValue('background-color');
        }
        node = node.parentNode;
    }

    if (!lifecycle.isDarkMode && node == contentDiv) {
        styleTextColor = styleTextColor || styles[2];
        styleBackColor = styleBackColor || styles[3];
    }

    const textColor = darkColorHandler.parseColorValue(styleTextColor);
    const backColor = darkColorHandler.parseColorValue(styleBackColor);

    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: textColor.lightModeColor,
        backgroundColor: backColor.lightModeColor,
        textColors: textColor.darkModeColor
            ? {
                  lightModeColor: textColor.lightModeColor,
                  darkModeColor: textColor.darkModeColor,
              }
            : undefined,
        backgroundColors: backColor.darkModeColor
            ? {
                  lightModeColor: backColor.lightModeColor,
                  darkModeColor: backColor.darkModeColor,
              }
            : undefined,
        lineHeight: styles[4],
        marginTop: styles[5],
        marginBottom: styles[6],
        textAlign: styles[7],
        direction: styles[8],
        fontWeight: styles[9],
    };
};
