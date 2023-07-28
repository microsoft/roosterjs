import { ChangeSource, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { reducedModelChildProcessor } from '../../domToModel/processors/reducedModelChildProcessor';
import {
    ContentModelDocument,
    ContentModelEntity,
    DomToModelOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export interface FormatWithContentModelOptions {
    /**
     * When set to true, it will only create Content Model for selected content
     */
    useReducedModel?: boolean;

    /**
     * When set to true, if there is pending format, it will be preserved after this format operation is done
     */
    preservePendingFormat?: boolean;

    /**
     * Change source used for triggering a ContentChanged event. @default ChangeSource.Format.
     */
    changeSource?: string;

    /**
     * An optional callback that will be called when a DOM node is created
     * @param modelElement The related Content Model element
     * @param node The node created for this model element
     */
    onNodeCreated?: OnNodeCreated;

    /**
     * Optional callback to get an object used for change data in ContentChangedEvent
     */
    getChangeData?: () => any;

    /**
     * Raw event object that triggers this call
     */
    rawEvent?: Event;
}

/**
 * @internal
 */
export interface DeletedEntity {
    entity: ContentModelEntity;
    operation:
        | EntityOperation.RemoveFromStart
        | EntityOperation.RemoveFromEnd
        | EntityOperation.Overwrite
        | CompatibleEntityOperation.RemoveFromStart
        | CompatibleEntityOperation.RemoveFromEnd
        | CompatibleEntityOperation.Overwrite;
}

/**
 * @internal
 */
export interface FormatWithContentModelContext {
    /**
     * Entities got deleted during formatting. Need to be set by the formatter function
     */
    readonly deleteEntities: DeletedEntity[];

    /**
     * Raw Event that triggers this format call
     */
    readonly rawEvent?: Event;

    /**
     * @optional
     * When pass true, skip adding undo snapshot when write Content Model back to DOM.
     * Need to be set by the formatter function
     */
    skipUndoSnapshot?: boolean;
}

/**
 * @internal
 */
export type ContentModelFormatter = (
    model: ContentModelDocument,
    context: FormatWithContentModelContext
) => boolean;

/**
 * @internal
 */
export function formatWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    formatter: ContentModelFormatter,
    options?: FormatWithContentModelOptions
) {
    const {
        useReducedModel,
        onNodeCreated,
        preservePendingFormat,
        getChangeData,
        changeSource,
        rawEvent,
    } = options || {};
    const domToModelOption: DomToModelOption | undefined = useReducedModel
        ? {
              processorOverride: {
                  child: reducedModelChildProcessor,
              },
          }
        : undefined;
    const model = editor.createContentModel(domToModelOption);
    const context: FormatWithContentModelContext = {
        deleteEntities: [],
        rawEvent,
    };

    if (formatter(model, context)) {
        const callback = () => {
            editor.focus();

            handleFormatResult(editor, context);

            if (model) {
                editor.setContentModel(model, { onNodeCreated });
            }

            if (preservePendingFormat) {
                const pendingFormat = getPendingFormat(editor);
                const pos = editor.getFocusedPosition();

                if (pendingFormat && pos) {
                    setPendingFormat(editor, pendingFormat, pos);
                }
            }

            return getChangeData?.();
        };

        if (context.skipUndoSnapshot) {
            const contentChangedEventData = callback();

            if (changeSource) {
                editor.triggerContentChangedEvent(changeSource, contentChangedEventData);
            }
        } else {
            editor.addUndoSnapshot(
                callback,
                changeSource || ChangeSource.Format,
                false /*canUndoByBackspace*/,
                {
                    formatApiName: apiName,
                }
            );
        }

        editor.cacheContentModel?.(model);
    }
}

function handleFormatResult(editor: IContentModelEditor, context: FormatWithContentModelContext) {
    context.deleteEntities.forEach(({ entity, operation }) => {
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
