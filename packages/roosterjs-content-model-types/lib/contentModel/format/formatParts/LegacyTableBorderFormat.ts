/**
 * Format for legacy table border.
 * This is used for supporting legacy table border rendering in some scenarios.
 */
export type LegacyTableBorderFormat = {
    /**
     * The value of border attribute on table element.
     * Although this attribute is deprecated in HTML5, some email clients still rely on it.
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/border
     */
    legacyTableBorder?: string;

    /**
     * The value of cellspacing attribute on table element.
     * This attribute is deprecated in HTML5, but still used in some legacy scenarios.
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/cellSpacing
     */
    cellSpacing?: string;

    /**
     * The value of cellpadding attribute on table element.
     * This attribute is deprecated in HTML5, but still used in some legacy scenarios.
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/cellPadding
     */
    cellpadding?: string;
};
