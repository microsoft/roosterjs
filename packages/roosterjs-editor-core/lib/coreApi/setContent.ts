import {
    createRange,
    extractContentMetadata,
    queryElements,
    restoreContentWithEntityPlaceholder,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ColorTransformDirection,
    ContentMetadata,
    EditorCore,
    PluginEventType,
    SelectionRangeTypes,
    SetContent,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The EditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 * @param metadata @optional Metadata of the content that helps editor know the selection and color mode.
 * If not passed, we will treat content as in light mode without selection
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

function selectContentMetadata(core: EditorCore, metadata: ContentMetadata | undefined) {
    if (!core.lifecycle.shadowEditSelectionPath && metadata) {
        core.domEvent.tableSelectionRange = null;
        core.domEvent.imageSelectionRange = null;
        core.domEvent.selectionRange = null;

        switch (metadata.type) {
            case SelectionRangeTypes.Normal:
                core.api.selectTable(core, null);
                core.api.selectImage(core, null);

                const range = createRange(core.contentDiv, metadata.start, metadata.end);
                core.api.selectRange(core, range);
                break;
            case SelectionRangeTypes.TableSelection:
                const table = queryElements(
                    core.contentDiv,
                    '#' + metadata.tableId
                )[0] as HTMLTableElement;

                if (table) {
                    core.domEvent.tableSelectionRange = core.api.selectTable(core, table, metadata);
                }
                break;
            case SelectionRangeTypes.ImageSelection:
                const image = queryElements(
                    core.contentDiv,
                    '#' + metadata.imageId
                )[0] as HTMLImageElement;

                if (image) {
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, image);
                }
                break;
        }
    }
}
