/**
 * A type to specify how to get a tool tip of hyperlink in editor
 * string: Use this string as tooltip
 * null: No tooltip
 * function: Call this function to get a tooltip
 */
export type HyperlinkToolTip = string | null | ((url: string, anchor: HTMLAnchorElement) => string);
