/**
 * Add global css styles
 * @param doc The document object
 * @param cssRule The css rule that must added to the selection
 * @param editorId Te id of the editor
 * @param styleId the ID of the style tag
 */

export default function setGlobalCssStyles(doc: Document, cssRule: string, styleId: string) {
    let styleTag = doc.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
        styleTag = doc.createElement('style');
        styleTag.id = styleId;
        doc.head.appendChild(styleTag);
    }
    styleTag.sheet?.insertRule(cssRule);
}
