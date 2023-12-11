import { ChangeSource, transformColor } from 'roosterjs-content-model-core';
import { convertMetadataToDOMSelection } from '../editor/utils/selectionConverter';
import { extractContentMetadata, restoreContentWithEntityPlaceholder } from 'roosterjs-editor-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentMetadata } from 'roosterjs-editor-types';
import type { SetContent, StandaloneEditorCore } from 'roosterjs-content-model-types';

/**
 * @internal
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The StandaloneEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 * @param metadata @optional Metadata of the content that helps editor know the selection and color mode.
 * If not passed, we will treat content as in light mode without selection
 */
export const setContent: SetContent = (core, content, triggerContentChangedEvent, metadata) => {
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

        const entities = core.entity.entityMap;
        const html = content || '';
        const body = new DOMParser().parseFromString(
            core.trustedHTMLHandler?.(html) ?? html,
            'text/html'
        ).body;

        restoreContentWithEntityPlaceholder(body, core.contentDiv, entities);

        const metadataFromContent = extractContentMetadata(core.contentDiv);
        metadata = metadata || metadataFromContent;
        selectContentMetadata(core, metadata);
        contentChanged = true;
    }

    const isDarkMode = core.lifecycle.isDarkMode;

    if ((!metadata && isDarkMode) || (metadata && !!metadata.isDarkMode != !!isDarkMode)) {
        transformColor(
            core.contentDiv,
            false /*includeSelf*/,
            isDarkMode ? 'lightToDark' : 'darkToLight',
            core.darkColorHandler
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

function selectContentMetadata(core: StandaloneEditorCore, metadata: ContentMetadata | undefined) {
    if (!core.lifecycle.shadowEditFragment && metadata) {
        const selection = convertMetadataToDOMSelection(core.contentDiv, metadata);

        if (selection) {
            core.api.setDOMSelection(core, selection);
        }
    }
}
