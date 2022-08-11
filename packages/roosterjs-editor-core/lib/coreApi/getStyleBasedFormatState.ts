import { DarkModeDatasetNames, EditorCore, GetStyleBasedFormatState } from 'roosterjs-editor-types';
import { findClosestElementAncestor, getComputedStyles } from 'roosterjs-editor-dom';

const ORIGINAL_STYLE_COLOR_SELECTOR = `[data-${DarkModeDatasetNames.OriginalStyleColor}],[data-${DarkModeDatasetNames.OriginalAttributeColor}]`;
const ORIGINAL_STYLE_BACK_COLOR_SELECTOR = `[data-${DarkModeDatasetNames.OriginalStyleBackgroundColor}],[data-${DarkModeDatasetNames.OriginalAttributeBackgroundColor}]`;

/**
 * @internal
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

    const styles = node ? getComputedStyles(node) : [];
    const isDarkMode = core.lifecycle.isDarkMode;
    const root = core.contentDiv;
    const ogTextColorNode =
        isDarkMode &&
        (override[2]
            ? pendableFormatSpan
            : findClosestElementAncestor(node, root, ORIGINAL_STYLE_COLOR_SELECTOR));
    const ogBackgroundColorNode =
        isDarkMode &&
        (override[3]
            ? pendableFormatSpan
            : findClosestElementAncestor(node, root, ORIGINAL_STYLE_BACK_COLOR_SELECTOR));

    return {
        fontName: override[0] || styles[0],
        fontSize: override[1] || styles[1],
        textColor: override[2] || styles[2],
        backgroundColor: override[3] || styles[3],
        textColors: ogTextColorNode
            ? {
                  darkModeColor: override[2] || styles[2],
                  lightModeColor:
                      ogTextColorNode.dataset[DarkModeDatasetNames.OriginalStyleColor] ||
                      ogTextColorNode.dataset[DarkModeDatasetNames.OriginalAttributeColor] ||
                      styles[2],
              }
            : undefined,
        backgroundColors: ogBackgroundColorNode
            ? {
                  darkModeColor: override[3] || styles[3],
                  lightModeColor:
                      ogBackgroundColorNode.dataset[
                          DarkModeDatasetNames.OriginalStyleBackgroundColor
                      ] ||
                      ogBackgroundColorNode.dataset[
                          DarkModeDatasetNames.OriginalAttributeBackgroundColor
                      ] ||
                      styles[3],
              }
            : undefined,
    };
};
