import EditorCore, { GetStyleBasedFormatState } from '../interfaces/EditorCore';
import { findClosestElementAncestor, getComputedStyles } from 'roosterjs-editor-dom';

const ORIGINAL_STYLE_COLOR_SELECTOR = '[data-ogsc],[data-ogac]';
const ORIGINAL_STYLE_BACK_COLOR_SELECTOR = '[data-ogsb],[data-ogab]';

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The EditorCore objects
 * @param node The node to get style from
 */
export const getStyleBasedFormatState: GetStyleBasedFormatState = (
    core: EditorCore,
    node: Node
) => {
    if (!node) {
        return {};
    }
    const styles = node ? getComputedStyles(node) : [];
    const isDarkMode = core.inDarkMode;
    const root = core.contentDiv;
    const ogTextColorNode =
        isDarkMode && findClosestElementAncestor(node, root, ORIGINAL_STYLE_COLOR_SELECTOR);
    const ogBackgroundColorNode =
        isDarkMode && findClosestElementAncestor(node, root, ORIGINAL_STYLE_BACK_COLOR_SELECTOR);

    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],
        textColors: ogTextColorNode
            ? {
                  darkModeColor: styles[2],
                  lightModeColor: ogTextColorNode.dataset.ogsc || ogTextColorNode.dataset.ogac,
              }
            : undefined,
        backgroundColors: ogBackgroundColorNode
            ? {
                  darkModeColor: styles[3],
                  lightModeColor:
                      ogBackgroundColorNode.dataset.ogsb || ogBackgroundColorNode.dataset.ogab,
              }
            : undefined,
    };
};
