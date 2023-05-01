import { contains, getComputedStyles } from 'roosterjs-editor-dom';
import { EditorCore, GetStyleBasedFormatState, NodeType } from 'roosterjs-editor-types';

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
          ])
        : [];
    const { contentDiv, darkColorHandler } = core;

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

    if (!core.lifecycle.isDarkMode && node == core.contentDiv) {
        styleTextColor = styleTextColor || styles[2];
        styleBackColor = styleBackColor || styles[3];
    }

    const textColor = darkColorHandler.parseColorValue(override[2] || styleTextColor);
    const backColor = darkColorHandler.parseColorValue(override[3] || styleBackColor);

    return {
        fontName: override[0] || styles[0],
        fontSize: override[1] || styles[1],
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
    };
};
