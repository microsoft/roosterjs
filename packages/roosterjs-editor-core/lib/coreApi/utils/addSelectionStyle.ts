import { EditorCore } from 'roosterjs-editor-types';

/**
 * Add style to selected elements
 * @param core The Editor core object
 * @param cssRule The css rule that must added to the selection
 * @param styleId the ID of the style tag
 */

export default function addSelectionStyle(core: EditorCore, cssRule: string, styleId: string) {
    const styleTagId = styleId + core.contentDiv.id;
    const doc = core.contentDiv.ownerDocument;
    let styleTag = doc.getElementById(styleTagId) as HTMLStyleElement;
    if (!styleTag) {
        styleTag = doc.createElement('style');
        styleTag.id = styleTagId;
        doc.head.appendChild(styleTag);
    }
    styleTag.sheet?.insertRule(cssRule);
}
