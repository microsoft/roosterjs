import { ChangeSource } from '../constants/ChangeSource';
import { ColorTransformDirection, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import type { Entity } from 'roosterjs-editor-types';
import type {
    ContentModelContentChangedEvent,
    DOMSelection,
    EntityRemovalOperation,
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
    let selection: DOMSelection | undefined;

    if (formatter(model, context)) {
        const writeBack = () => {
            handleNewEntities(core, context);
            handleDeletedEntities(core, context);
            handleImages(core, context);

            selection =
                core.api.setContentModel(core, model, undefined /*options*/, onNodeCreated) ||
                undefined;

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

function handleNewEntities(core: StandaloneEditorCore, context: FormatWithContentModelContext) {
    // TODO: Ideally we can trigger NewEntity event here. But to be compatible with original editor code, we don't do it here for now.
    // Once Content Model Editor can be standalone, we can change this behavior to move triggering NewEntity event code
    // from EntityPlugin to here

    if (core.lifecycle.isDarkMode) {
        context.newEntities.forEach(entity => {
            core.api.transformColor(
                core,
                entity.wrapper,
                true /*includeSelf*/,
                null /*callback*/,
                ColorTransformDirection.LightToDark
            );
        });
    }
}

// This is only used for compatibility with old editor
// TODO: Remove this map once we have standalone editor
const EntityOperationMap: Record<EntityRemovalOperation, EntityOperation> = {
    overwrite: EntityOperation.Overwrite,
    removeFromEnd: EntityOperation.RemoveFromEnd,
    removeFromStart: EntityOperation.RemoveFromStart,
};

function handleDeletedEntities(core: StandaloneEditorCore, context: FormatWithContentModelContext) {
    context.deletedEntities.forEach(
        ({
            entity: {
                wrapper,
                entityFormat: { id, entityType, isReadonly },
            },
            operation,
        }) => {
            if (id && entityType) {
                // TODO: Revisit this entity parameter for standalone editor, we may just directly pass ContentModelEntity object instead
                const entity: Entity = {
                    id,
                    type: entityType,
                    isReadonly: !!isReadonly,
                    wrapper,
                };
                core.api.triggerEvent(
                    core,
                    {
                        eventType: PluginEventType.EntityOperation,
                        entity,
                        operation: EntityOperationMap[operation],
                        rawEvent: context.rawEvent,
                    },
                    false /*broadcast*/
                );
            }
        }
    );
}

function handleImages(core: StandaloneEditorCore, context: FormatWithContentModelContext) {
    if (context.newImages.length > 0) {
        const viewport = core.getVisibleViewport();

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
