import { ChangeSource } from '../constants/ChangeSource';
import type {
    ChangedEntity,
    ContentChangedEvent,
    DOMSelection,
    FormatContentModel,
    FormatContentModelContext,
    EditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * The general API to do format change with Content Model
 * It will grab a Content Model for current editor content, and invoke a callback function
 * to do format change. Then according to the return value, write back the modified content model into editor.
 * If there is cached model, it will be used and updated.
 * @param core The EditorCore object
 * @param formatter Formatter function, see ContentModelFormatter
 * @param options More options, see FormatContentModelOptions
 */
export const formatContentModel: FormatContentModel = (core, formatter, options) => {
    const { apiName, onNodeCreated, getChangeData, changeSource, rawEvent, selectionOverride } =
        options || {};
    const model = core.api.createContentModel(core, undefined /*option*/, selectionOverride);
    const context: FormatContentModelContext = {
        newEntities: [],
        deletedEntities: [],
        rawEvent,
        newImages: [],
    };

    const hasFocus = core.api.hasFocus(core);

    const changed = formatter(model, context);
    const { skipUndoSnapshot, clearModelCache, entityStates, canUndoByBackspace } = context;

    if (changed) {
        const isNested = core.undo.isNested;
        const shouldAddSnapshot = !skipUndoSnapshot && !isNested;
        let selection: DOMSelection | undefined;

        if (shouldAddSnapshot) {
            core.undo.isNested = true;

            if (core.undo.snapshotsManager.hasNewContent || entityStates) {
                core.api.addUndoSnapshot(core, !!canUndoByBackspace);
            }
        }

        try {
            handleImages(core, context);

            selection =
                core.api.setContentModel(
                    core,
                    model,
                    hasFocus ? undefined : { ignoreSelection: true }, // If editor did not have focus before format, do not set focus after format
                    onNodeCreated
                ) ?? undefined;

            handlePendingFormat(core, context, selection);

            const eventData: ContentChangedEvent = {
                eventType: 'contentChanged',
                contentModel: clearModelCache ? undefined : model,
                selection: clearModelCache ? undefined : selection,
                source: changeSource || ChangeSource.Format,
                data: getChangeData?.(),
                formatApiName: apiName,
                changedEntities: getChangedEntities(context, rawEvent),
            };

            core.api.triggerEvent(core, eventData, true /*broadcast*/);

            if (canUndoByBackspace && selection?.type == 'range') {
                core.undo.posContainer = selection.range.startContainer;
                core.undo.posOffset = selection.range.startOffset;
            }

            if (shouldAddSnapshot) {
                core.api.addUndoSnapshot(core, !!canUndoByBackspace, entityStates);
            } else {
                core.undo.snapshotsManager.hasNewContent = true;
            }
        } finally {
            if (!isNested) {
                core.undo.isNested = false;
            }
        }
    } else {
        if (clearModelCache) {
            core.cache.cachedModel = undefined;
            core.cache.cachedSelection = undefined;
        }

        handlePendingFormat(core, context, core.api.getDOMSelection(core));
    }
};

function handleImages(core: EditorCore, context: FormatContentModelContext) {
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
    core: EditorCore,
    context: FormatContentModelContext,
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

function getChangedEntities(context: FormatContentModelContext, rawEvent?: Event): ChangedEntity[] {
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
