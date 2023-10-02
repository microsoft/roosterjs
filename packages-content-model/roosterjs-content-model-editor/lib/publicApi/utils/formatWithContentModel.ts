import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import type { Entity } from 'roosterjs-editor-types';
import type { ContentModelContentChangedEventData } from '../../publicTypes/event/ContentModelContentChangedEvent';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type {
    ContentModelFormatter,
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
    editor: IContentModelEditor,
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

    editor.focus();

    const model = editor.createContentModel(undefined /*option*/, selectionOverride);
    const context: FormatWithContentModelContext = {
        newEntities: [],
        deletedEntities: [],
        rawEvent,
    };
    let selection: DOMSelection | undefined;

    if (formatter(model, context)) {
        const writeBack = () => {
            handleNewEntities(editor, context);
            handleDeletedEntities(editor, context);

            selection =
                editor.setContentModel(model, undefined /*options*/, onNodeCreated) || undefined;

            if (preservePendingFormat) {
                const pendingFormat = getPendingFormat(editor);
                const pos = editor.getFocusedPosition();

                if (pendingFormat && pos) {
                    setPendingFormat(editor, pendingFormat, pos);
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

function handleNewEntities(editor: IContentModelEditor, context: FormatWithContentModelContext) {
    // TODO: Ideally we can trigger NewEntity event here. But to be compatible with original editor code, we don't do it here for now.
    // Once Content Model Editor can be standalone, we can change this behavior to move triggering NewEntity event code
    // from EntityPlugin to here

    if (editor.isDarkMode()) {
        context.newEntities.forEach(entity => {
            editor.transformToDarkColor(entity.wrapper);
        });
    }
}

function handleDeletedEntities(
    editor: IContentModelEditor,
    context: FormatWithContentModelContext
) {
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
                    operation,
                    rawEvent: context.rawEvent,
                });
            }
        }
    );
}
