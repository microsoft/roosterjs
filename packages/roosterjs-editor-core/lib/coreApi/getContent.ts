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
    toArray,
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
    const isDarkMode = core.darkMode.value.isDarkMode;
    const triggerExtractContentEvent = mode == GetContentMode.CleanHTML;
    const includeSelectionMarker = mode == GetContentMode.RawHTMLWithSelection;

    if (mode == GetContentMode.PlainText) {
        content = getTextContent(core.contentDiv);
    } else if (triggerExtractContentEvent || isDarkMode) {
        const clonedRoot = core.contentDiv.cloneNode(true /*deep*/) as HTMLElement;
        const originalRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
        const path =
            includeSelectionMarker &&
            originalRange &&
            getSelectionPath(core.contentDiv, originalRange);
        const range = path && createRange(clonedRoot, path.start, path.end);

        if (isDarkMode) {
            core.api.transformColor(
                core,
                toArray(clonedRoot.getElementsByTagName('*')) as HTMLElement[],
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
            core.contentDiv,
            includeSelectionMarker && core.api.getSelectionRange(core, true /*tryGetFromCache*/)
        );
    }

    return content;
};
