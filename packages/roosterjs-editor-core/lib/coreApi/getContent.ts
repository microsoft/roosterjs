import {
    ColorTransformDirection,
    EditorCore,
    GetContent,
    GetContentMode,
    PluginEventType,
} from 'roosterjs-editor-types';
import {
    createRange,
    getHtmlWithSelectionPath,
    getSelectionPath,
    getTextContent,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Get current editor content as HTML string
 * @param core The EditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export const getContent: GetContent = (core: EditorCore, mode: GetContentMode): string => {
    let content = '';
    const triggerExtractContentEvent = mode == GetContentMode.CleanHTML;
    const includeSelectionMarker = mode == GetContentMode.RawHTMLWithSelection;

    // When there is fragment for shadow edit, always use the cached fragment as document since HTML node in editor
    // has been changed by uncommited shadow edit which should be ignored.
    const root = core.lifecycle.shadowEditFragment || core.contentDiv;

    if (mode == GetContentMode.PlainText) {
        content = getTextContent(root);
    } else if (triggerExtractContentEvent || core.lifecycle.isDarkMode) {
        const clonedRoot = cloneNode(root);
        const originalRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
        const path = !includeSelectionMarker
            ? null
            : core.lifecycle.shadowEditFragment
            ? core.lifecycle.shadowEditSelectionPath
            : originalRange
            ? getSelectionPath(core.contentDiv, originalRange)
            : null;
        const range = path && createRange(clonedRoot, path.start, path.end);

        if (core.lifecycle.isDarkMode) {
            core.api.transformColor(
                core,
                clonedRoot,
                false /*includeSelf*/,
                null /*callback*/,
                ColorTransformDirection.DarkToLight
            );
        }

        if (triggerExtractContentEvent) {
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot,
                },
                true /*broadcast*/
            );

            content = clonedRoot.innerHTML;
        } else if (range) {
            // range is not null, which means we want to include a selection path in the content
            content = getHtmlWithSelectionPath(clonedRoot, range);
        } else {
            content = clonedRoot.innerHTML;
        }
    } else {
        content = getHtmlWithSelectionPath(
            root,
            includeSelectionMarker && core.api.getSelectionRange(core, true /*tryGetFromCache*/)
        );
    }

    return content;
};

function cloneNode(node: HTMLElement | DocumentFragment): HTMLElement {
    let clonedNode: HTMLElement;
    if (safeInstanceOf(node, 'DocumentFragment')) {
        clonedNode = node.ownerDocument.createElement('div');
        clonedNode.appendChild(node.cloneNode(true /*deep*/));
    } else {
        clonedNode = node.cloneNode(true /*deep*/) as HTMLElement;
    }

    return clonedNode;
}
