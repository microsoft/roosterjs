import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelContentChangedEventData } from '../../publicTypes/event/ContentModelContentChangedEvent';
import { DOMSelection } from 'roosterjs-content-model-types';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
} from '../../publicTypes/parameter/FormatWithContentModelContext';

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
    context.deletedEntities.forEach(({ entity, operation }) => {
        if (entity.id && entity.type) {
            editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                entity: {
                    id: entity.id,
                    isReadonly: entity.isReadonly,
                    type: entity.type,
                    wrapper: entity.wrapper,
                },
                operation,
                rawEvent: context.rawEvent,
            });
        }
    });
}
