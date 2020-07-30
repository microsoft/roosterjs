import EditorCore, { GetContent } from '../interfaces/EditorCore';
import normalizeContentColor from '../darkMode/normalizeContentColor';
import { createRange, getHtmlWithSelectionPath, getSelectionPath } from 'roosterjs-editor-dom';
import { PluginEventType } from 'roosterjs-editor-types';

export const getContent: GetContent = (
    core: EditorCore,
    triggerExtractContentEvent: boolean,
    includeSelectionMarker: boolean
): string => {
    let content = '';
    const isDarkMode = core.darkMode.value.isDarkMode;
    if (triggerExtractContentEvent || isDarkMode) {
        const clonedRoot = core.contentDiv.cloneNode(true /*deep*/) as HTMLElement;
        const originalRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
        const path =
            includeSelectionMarker &&
            originalRange &&
            getSelectionPath(core.contentDiv, originalRange);
        const range = path && createRange(clonedRoot, path.start, path.end);

        if (isDarkMode) {
            normalizeContentColor(clonedRoot);
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
