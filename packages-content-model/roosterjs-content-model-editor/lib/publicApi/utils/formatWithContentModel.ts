import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import {
    ChangeSource,
    getPendingFormat,
    ICoreEditor,
    setPendingFormat,
} from 'roosterjs-content-model-core';
import type { Entity } from 'roosterjs-editor-types';
import type { ContentModelContentChangedEventData } from '../../publicTypes/event/ContentChangedEvent';
import type {
    ContentModelFormatter,
    EntityRemovalOperation,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
} from '../../publicTypes/parameter/FormatWithContentModelContext';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * The general API to do format change with Content Model
 * It will grab a Content Model for current editor content, and invoke a callback function
 * to do format change. Then according to the return value, write back the modified content model into editor.
 * If there is cached model, it will be used and updated.
 * @param editor Content Model editor
 * @param apiName Name of the format API
 * @param formatter Formatter function, see ContentModelFormatter
 * @param options More options, see FormatWithContentModelOptions
 */
export function formatWithContentModel(
    editor: ICoreEditor,
    apiName: string,
    formatter: ContentModelFormatter,
    options?: FormatWithContentModelOptions
) {
    const {
        onNodeCreated,
        preservePendingFormat,
        getChangeData,
        changeSource,
        rawEvent,
        selectionOverride,
    } = options || {};

    const model = editor.createContentModel(undefined /*option*/, selectionOverride);
    const context: FormatWithContentModelContext = {
        newEntities: [],
        deletedEntities: [],
        rawEvent,
        newImages: [],
    };
    let selection: DOMSelection | undefined;

    if (formatter(model, context)) {
        const writeBack = () => {
            handleNewEntities(editor, context);
            handleDeletedEntities(editor, context);
            handleImages(editor, context);

            selection =
                editor.setContentModel(model, undefined /*options*/, onNodeCreated) || undefined;

            if (preservePendingFormat) {
                const pendingFormat = getPendingFormat(editor);
                const pos = editor.getFocusedPosition();

                if (pendingFormat && pos) {
                    setPendingFormat(editor, pendingFormat, pos.node, pos.offset);
                }
            }
        };

        if (context.skipUndoSnapshot) {
            writeBack();
        } else {
            editor.addUndoSnapshot(
                writeBack,
                undefined /*changeSource, passing undefined here to avoid triggering ContentChangedEvent. We will trigger it using it with Content Model below */,
                false /*canUndoByBackspace*/,
                {
                    formatApiName: apiName,
                }
            );
        }

        const eventData: ContentModelContentChangedEventData = {
            contentModel: model,
            selection: selection,
            source: changeSource || ChangeSource.Format,
            data: getChangeData?.(),
            additionalData: {
                formatApiName: apiName,
            },
        };
        editor.triggerPluginEvent(PluginEventType.ContentChanged, eventData);
    }
}

function handleNewEntities(editor: ICoreEditor, context: FormatWithContentModelContext) {
    // TODO: Ideally we can trigger NewEntity event here. But to be compatible with original editor code, we don't do it here for now.
    // Once Content Model Editor can be standalone, we can change this behavior to move triggering NewEntity event code
    // from EntityPlugin to here

    if (editor.isDarkMode()) {
        context.newEntities.forEach(entity => {
            editor.transformToDarkColor(entity.wrapper);
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

function handleDeletedEntities(editor: ICoreEditor, context: FormatWithContentModelContext) {
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
                editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                    entity,
                    operation: EntityOperationMap[operation],
                    rawEvent: context.rawEvent,
                });
            }
        }
    );
}

function handleImages(editor: ICoreEditor, context: FormatWithContentModelContext) {
    if (context.newImages.length > 0) {
        const viewport = editor.getVisibleViewport();
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
