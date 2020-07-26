import EditorCore, { GetContent } from '../interfaces/EditorCore';
import normalizeContentColor from '../darkMode/normalizeContentColor';
import { createRange, getHtmlWithSelectionPath, getSelectionPath } from 'roosterjs-editor-dom';
import { ExtractContentEvent, PluginEventType } from 'roosterjs-editor-types';

export const getContent: GetContent = (
    core: EditorCore,
    triggerExtractContentEvent: boolean,
    includeSelectionMarker: boolean
): string => {
    let content = '';
    if (triggerExtractContentEvent || core.inDarkMode) {
        const clonedRoot = core.contentDiv.cloneNode(true /*deep*/) as HTMLElement;
        const originalRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
        const path =
            includeSelectionMarker &&
            originalRange &&
            getSelectionPath(core.contentDiv, originalRange);
        const range = path && createRange(clonedRoot, path.start, path.end);

        if (core.inDarkMode) {
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

            // TODO: Deprecated ExtractContentEvent once we have entity API ready in next major release
            const extractContentEvent: ExtractContentEvent = {
                eventType: PluginEventType.ExtractContent,
                content: clonedRoot.innerHTML,
            };
            core.api.triggerEvent(core, extractContentEvent, true /*broadcast*/);
            content = extractContentEvent.content;
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
