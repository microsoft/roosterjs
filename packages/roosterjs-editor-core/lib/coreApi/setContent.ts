import { selectContentMetadata } from './utils/selectContentMetadata';
import { setHtmlWithMetadata } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ColorTransformDirection,
    ContentMetadata,
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
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
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

        const metadataFromContent = setHtmlWithMetadata(
            core.contentDiv,
            content,
            core.trustedHTMLHandler
        );

        metadata = metadata || metadataFromContent;
        selectContentMetadata(core, metadata);
        contentChanged = true;
    }

    const isDarkMode = core.lifecycle.isDarkMode;

    if ((!metadata && isDarkMode) || (metadata && !!metadata.isDarkMode != !!isDarkMode)) {
        core.api.transformColor(
            core,
            core.contentDiv,
            false /*includeSelf*/,
            null /*callback*/,
            isDarkMode ? ColorTransformDirection.LightToDark : ColorTransformDirection.DarkToLight,
            true /*forceTransform*/,
            metadata?.isDarkMode
        );
        contentChanged = true;
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
