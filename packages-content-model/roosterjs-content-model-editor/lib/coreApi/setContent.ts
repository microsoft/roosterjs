import { ChangeSource, transformColor } from 'roosterjs-content-model-core';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    createRange,
    extractContentMetadata,
    queryElements,
    restoreContentWithEntityPlaceholder,
} from 'roosterjs-editor-dom';
import type { ContentMetadata } from 'roosterjs-editor-types';
import type { SetContent } from '../publicTypes/ContentModelEditorCore';
import type { DOMSelection, StandaloneEditorCore } from 'roosterjs-content-model-types';

/**
 * @internal
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The ContentModelEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 * @param metadata @optional Metadata of the content that helps editor know the selection and color mode.
 * If not passed, we will treat content as in light mode without selection
 */
export const setContent: SetContent = (
    core,
    innerCore,
    content,
    triggerContentChangedEvent,
    metadata
) => {
    const {
        contentDiv,
        api,
        entity,
        trustedHTMLHandler,
        lifecycle,
        undo: { snapshotsManager },
    } = innerCore;

    let contentChanged = false;

    if (innerCore.contentDiv.innerHTML != content) {
        api.triggerEvent(
            innerCore,
            {
                eventType: 'beforeSetContent',
                newContent: content,
            },
            true /*broadcast*/
        );

        const entities = entity.entityMap;
        const html = content || '';
        const body = new DOMParser().parseFromString(
            trustedHTMLHandler?.(html) ?? html,
            'text/html'
        ).body;

        restoreContentWithEntityPlaceholder(body, contentDiv, entities);

        const metadataFromContent = extractContentMetadata(contentDiv);
        metadata = metadata || metadataFromContent;
        selectContentMetadata(innerCore, metadata);
        contentChanged = true;
    }

    const isDarkMode = lifecycle.isDarkMode;

    if ((!metadata && isDarkMode) || (metadata && !!metadata.isDarkMode != !!isDarkMode)) {
        transformColor(
            contentDiv,
            false /*includeSelf*/,
            isDarkMode ? 'lightToDark' : 'darkToLight',
            snapshotsManager
        );
        contentChanged = true;
    }

    if (triggerContentChangedEvent && contentChanged) {
        api.triggerEvent(
            innerCore,
            {
                eventType: 'contentChanged',
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

function convertMetadataToDOMSelection(
    contentDiv: HTMLElement,
    metadata: ContentMetadata | undefined
): DOMSelection | null {
    switch (metadata?.type) {
        case SelectionRangeTypes.Normal:
            return {
                type: 'range',
                range: createRange(contentDiv, metadata.start, metadata.end),
            };
        case SelectionRangeTypes.TableSelection:
            const table = queryElements(contentDiv, '#' + metadata.tableId)[0] as HTMLTableElement;

            return table
                ? {
                      type: 'table',
                      table: table,
                      firstColumn: metadata.firstCell.x,
                      firstRow: metadata.firstCell.y,
                      lastColumn: metadata.lastCell.x,
                      lastRow: metadata.lastCell.y,
                  }
                : null;
        case SelectionRangeTypes.ImageSelection:
            const image = queryElements(contentDiv, '#' + metadata.imageId)[0] as HTMLImageElement;

            return image
                ? {
                      type: 'image',
                      image: image,
                  }
                : null;

        default:
            return null;
    }
}
