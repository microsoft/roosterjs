import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DomToModelOption, IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { OnNodeCreated } from '../../publicTypes/context/ModelToDomSettings';
import { reducedModelChildProcessor } from '../../domToModel/processors/reducedModelChildProcessor';

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
     * When pass true, skip adding undo snapshot when write Content Model back to DOM
     */
    skipUndoSnapshot?: boolean;

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
}

/**
 * @internal
 */
export function formatWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    callback: (model: ContentModelDocument) => boolean,
    options?: FormatWithContentModelOptions
) {
    const {
        useReducedModel,
        onNodeCreated,
        preservePendingFormat,
        getChangeData,
        skipUndoSnapshot,
        changeSource,
    } = options || {};
    const domToModelOption: DomToModelOption | undefined = useReducedModel
        ? {
              processorOverride: {
                  child: reducedModelChildProcessor,
              },
          }
        : undefined;
    const model = editor.createContentModel(domToModelOption);

    if (callback(model)) {
        const callback = () => {
            editor.focus();
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

        if (skipUndoSnapshot) {
            callback();

            if (changeSource) {
                editor.triggerContentChangedEvent(changeSource, getChangeData?.());
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
