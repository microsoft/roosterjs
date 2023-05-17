import {
    createRange,
    extractContentMetadata,
    queryElements,
    restoreContentWithEntityPlaceholder,
    setHtmlWithMetadata,
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
    let changeSource: string | null = null;

    if (core.contentDiv.innerHTML != content) {
        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.BeforeSetContent,
                newContent: content,
            },
            true /*broadcast*/
        );

        const entities = core.entity.entities;
        const hasEntities = Object.keys(entities).length > 0;
        let metadataFromContent: ContentMetadata | undefined;

        if (hasEntities) {
            let html = content || '';
            html = core.trustedHTMLHandler?.(html) || html;

            const body = new DOMParser().parseFromString(html, 'text/html').body;

            restoreContentWithEntityPlaceholder(body, core.contentDiv, entities);

            metadataFromContent = extractContentMetadata(core.contentDiv);

            changeSource = ChangeSource.Undo;
        } else {
            metadataFromContent = setHtmlWithMetadata(
                core.contentDiv,
                content,
                core.trustedHTMLHandler
            );
            changeSource = ChangeSource.SetContent;
        }

        metadata = metadata || metadataFromContent;
        selectContentMetadata(core, metadata);
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
    }

    if (triggerContentChangedEvent && changeSource) {
        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: changeSource,
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
