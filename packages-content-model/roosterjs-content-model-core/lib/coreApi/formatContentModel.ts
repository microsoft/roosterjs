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

    const changed = formatter(model, context);
    const { skipUndoSnapshot, clearModelCache, entityStates, canUndoByBackspace } = context;

    if (changed) {
        const isNested = core.undo.isNested;
        const shouldAddSnapshot = !skipUndoSnapshot && !isNested;
        let selection: DOMSelection | undefined;

        if (shouldAddSnapshot) {
            core.undo.isNested = true;

            if (core.undo.hasNewContent || entityStates) {
                core.api.addUndoSnapshot(core, !!canUndoByBackspace);
            }
        }

        try {
            handleImages(core, context);

            selection =
                core.api.setContentModel(core, model, undefined /*options*/, onNodeCreated) ??
                undefined;

            handlePendingFormat(core, context, selection);

            if (shouldAddSnapshot) {
                core.api.addUndoSnapshot(core, false /*canUndoByBackspace*/, entityStates);
            }
        } finally {
            if (!isNested) {
                core.undo.isNested = false;
            }
        }

        const eventData: ContentModelContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            contentModel: clearModelCache ? undefined : model,
            selection: clearModelCache ? undefined : selection,
            source: changeSource || ChangeSource.Format,
            data: getChangeData?.(),
            additionalData: {
                formatApiName: apiName,
            },
            changedEntities: getChangedEntities(context, rawEvent),
        };

        core.api.triggerEvent(core, eventData, true /*broadcast*/);

        if (canUndoByBackspace && selection?.type == 'range') {
            core.undo.hasNewContent = false;
            core.undo.posContainer = selection.range.startContainer;
            core.undo.posOffset = selection.range.startOffset;
        }
    } else {
        if (clearModelCache) {
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

function getChangedEntities(
    context: FormatWithContentModelContext,
    rawEvent?: Event
): ChangedEntity[] {
    return context.newEntities
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
        );
}
