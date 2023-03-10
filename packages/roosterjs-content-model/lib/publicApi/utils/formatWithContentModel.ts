import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DomToModelOption, IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
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
    const domToModelOption: DomToModelOption | undefined = options?.useReducedModel
        ? {
              processorOverride: {
                  child: reducedModelChildProcessor,
              },
          }
        : undefined;
    const model = editor.createContentModel(domToModelOption);

    if (callback(model)) {
        editor.addUndoSnapshot(
            () => {
                editor.focus();
                if (model) {
                    editor.setContentModel(model);
                }

                if (options?.preservePendingFormat) {
                    const pendingFormat = getPendingFormat(editor);
                    const pos = editor.getFocusedPosition();

                    if (pendingFormat && pos) {
                        setPendingFormat(editor, pendingFormat, pos);
                    }
                }
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: apiName,
            }
        );

        editor.cacheContentModel?.(model);
    }
}
