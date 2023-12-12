import { ChangeSource } from '../constants/ChangeSource';
import { PluginEventType } from 'roosterjs-editor-types';
import type {
    ChangedEntity,
    ContentModelContentChangedEvent,
    DOMSelection,
    FormatContentModel,
    FormatWithContentModelContext,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * The general API to do format change with Content Model
 * It will grab a Content Model for current editor content, and invoke a callback function
 * to do format change. Then according to the return value, write back the modified content model into editor.
 * If there is cached model, it will be used and updated.
 * @param core The StandaloneEditorCore object
 * @param formatter Formatter function, see ContentModelFormatter
 * @param options More options, see FormatWithContentModelOptions
 */
export const formatContentModel: FormatContentModel = (core, formatter, options) => {
    const { apiName, onNodeCreated, getChangeData, changeSource, rawEvent, selectionOverride } =
        options || {};

    const model = core.api.createContentModel(core, undefined /*option*/, selectionOverride);
    const context: FormatWithContentModelContext = {
        newEntities: [],
        deletedEntities: [],
        rawEvent,
        newImages: [],
    };
    const hasFocus = core.api.hasFocus(core);
    let selection: DOMSelection | undefined;

    if (formatter(model, context)) {
        const writeBack = () => {
            handleImages(core, context);

            selection =
                core.api.setContentModel(
                    core,
                    model,
                    hasFocus ? undefined : { ignoreSelection: true }, // If editor did not have focus before format, do not set focus after format
                    onNodeCreated
                ) || undefined;

            handlePendingFormat(core, context, selection);
        };

        if (context.skipUndoSnapshot) {
            writeBack();
        } else {
            core.api.addUndoSnapshot(
                core,
                writeBack,
                null /*changeSource, passing undefined here to avoid triggering ContentChangedEvent. We will trigger it using it with Content Model below */,
                false /*canUndoByBackspace*/,
                {
                    formatApiName: apiName,
                }
            );
        }

        const eventData: ContentModelContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            contentModel: context.clearModelCache ? undefined : model,
            selection: context.clearModelCache ? undefined : selection,
            source: changeSource || ChangeSource.Format,
            data: getChangeData?.(),
            additionalData: {
                formatApiName: apiName,
            },
            changedEntities: context.newEntities
                .map(
                    (entity): ChangedEntity => ({
                        entity,
                        operation: 'newEntity',
                        rawEvent,
                    })
                )
                .concat(
                    context.deletedEntities.map(entry => ({
                        entity: entry.entity,
                        operation: entry.operation,
                        rawEvent,
                    }))
                ),
        };
        core.api.triggerEvent(core, eventData, true /*broadcast*/);
    } else {
        if (context.clearModelCache) {
            core.cache.cachedModel = undefined;
            core.cache.cachedSelection = undefined;
        }

        handlePendingFormat(core, context, core.api.getDOMSelection(core));
    }
};

function handleImages(core: StandaloneEditorCore, context: FormatWithContentModelContext) {
    if (context.newImages.length > 0) {
        const viewport = core.api.getVisibleViewport(core);

        if (viewport) {
            const { left, right } = viewport;
            const minMaxImageSize = 10;
            const maxWidth = Math.max(right - left, minMaxImageSize);
            context.newImages.forEach(image => {
                image.format.maxWidth = `${maxWidth}px`;
            });
        }
    }
}

function handlePendingFormat(
    core: StandaloneEditorCore,
    context: FormatWithContentModelContext,
    selection?: DOMSelection | null
) {
    const pendingFormat =
        context.newPendingFormat == 'preserve'
            ? core.format.pendingFormat?.format
            : context.newPendingFormat;

    if (pendingFormat && selection?.type == 'range' && selection.range.collapsed) {
        core.format.pendingFormat = {
            format: { ...pendingFormat },
            posContainer: selection.range.startContainer,
            posOffset: selection.range.startOffset,
        };
    }
}
