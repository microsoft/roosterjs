import { setHtmlWithSelectionPath } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ColorTransformDirection,
    EditorCore,
    PluginEventType,
    SetContent,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The EditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export const setContent: SetContent = (
    core: EditorCore,
    content: string,
    triggerContentChangedEvent: boolean
) => {
    let contentChanged = false;
    if (core.contentDiv.innerHTML != content) {
        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.BeforeSetContent,
                newContent: content,
            },
            true /*broadcast*/
        );

        const range = setHtmlWithSelectionPath(core.contentDiv, content, core.trustedHTMLHandler);
        core.api.selectRange(core, range);
        contentChanged = true;
    }

    // Convert content even if it hasn't changed.
    core.api.transformColor(
        core,
        core.contentDiv,
        false /*includeSelf*/,
        null /*callback*/,
        ColorTransformDirection.LightToDark
    );

    if (triggerContentChangedEvent && (contentChanged || core.lifecycle.isDarkMode)) {
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
