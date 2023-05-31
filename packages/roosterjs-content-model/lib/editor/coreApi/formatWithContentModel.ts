import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DomToModelOption } from '../../publicTypes/IContentModelEditor';
import { FormatWithContentModelOptions } from '../../publicApi/utils/formatWithContentModel';
import { reducedModelChildProcessor } from '../../domToModel/processors/reducedModelChildProcessor';
import {
    getPendingFormatFromCore,
    setPendingFormatFromCore,
} from '../../modelApi/format/pendingFormat';
import {
    ContentModelEditorCore,
    FormatWithContentModel,
} from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create content model from clipboard data
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param position The position to paste to
 * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original format
 */
export const formatWithContentModel: FormatWithContentModel = (
    core: ContentModelEditorCore,
    apiName: string,
    callback: (model: ContentModelDocument) => boolean,
    options?: FormatWithContentModelOptions
) => {
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
    const model = core.api.createContentModel(core, domToModelOption);

    if (callback(model)) {
        const undoSnapshotCallback = () => {
            core.api.focus(core);
            if (model) {
                core.api.setContentModel(core, model, { onNodeCreated });
            }

            if (preservePendingFormat) {
                const pendingFormat = getPendingFormatFromCore(core);
                const pos = core.api.getFocusedPosition(core);

                if (pendingFormat && pos) {
                    setPendingFormatFromCore(core, pendingFormat, pos);
                }
            }

            return getChangeData?.();
        };

        if (skipUndoSnapshot) {
            undoSnapshotCallback();

            if (changeSource) {
                core.api.triggerEvent(
                    core,
                    {
                        eventType: PluginEventType.ContentChanged,
                        source: ChangeSource.Format,
                        data: getChangeData?.(),
                    },
                    false /* broadcast */
                );
            }
        } else {
            core.api.addUndoSnapshot(
                core,
                undoSnapshotCallback,
                changeSource || ChangeSource.Format,
                false /*canUndoByBackspace*/,
                {
                    formatApiName: apiName,
                }
            );
        }

        if (core.reuseModel && !core.lifecycle.shadowEditFragment) {
            core.cachedModel = model || undefined;
        }
    }
};
