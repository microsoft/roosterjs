/**
 * Remove a css rule style from a style sheet
 * @param doc The document object
 * @param styleId the ID of the style tag
 */

export default function removeGlobalCssStyle(doc: Document, styleId: string) {
    const styleTag = doc.getElementById(styleId) as HTMLStyleElement;
    if (styleTag) {
        styleTag.parentNode?.removeChild(styleTag);
    }
}
