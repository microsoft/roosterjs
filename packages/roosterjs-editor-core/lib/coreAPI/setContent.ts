import EditorCore, { SetContent } from '../interfaces/EditorCore';
import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { convertContentToDarkMode } from '../corePlugins/darkMode/convertContentToDarkMode';
import { setHtmlWithSelectionPath } from 'roosterjs-editor-dom';

export const setContent: SetContent = (
    core: EditorCore,
    content: string,
    triggerContentChangedEvent: boolean
) => {
    let contentChanged = false;
    if (core.contentDiv.innerHTML != content) {
        const range = setHtmlWithSelectionPath(core.contentDiv, content);
        core.api.selectRange(core, range);
        contentChanged = true;
    }

    // Convert content even if it hasn't changed.
    if (core.darkMode.value.isDarkMode) {
        const convertFunction = convertContentToDarkMode(
            core.contentDiv,
            core.darkMode.value.onExternalContentTransform,
            true /* skipRootElement */
        );
        if (convertFunction) {
            convertFunction();
            contentChanged = true;
        }
    }

    if (triggerContentChangedEvent && contentChanged) {
        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false /*broadcast*/
        );
    }
};
