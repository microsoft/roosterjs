import { ChangeSource, IEditor, NodePosition } from 'roosterjs-editor-types';

/**
 * @internal
 * Execute add undo snapshot for the Format APIs
 * @param editor The editor instance
 * @param command Optional, The callback function to perform formatting, returns a data object which will be used as the data field in ContentChangedEvent if changeSource is not null.
 * @param apiName Optional, name of the API that was is going to be executed.
 * Default value is false.
 */
export default function formatUndoSnapshot(
    editor: IEditor,
    callback?: (start: NodePosition | null, end: NodePosition | null) => any,
    apiName?: string
) {
    editor.addUndoSnapshot(
        callback,
        ChangeSource.Format,
        undefined /* canUndoByBackspace */,
        apiName && apiName != ''
            ? {
                  formatApiName: apiName,
              }
            : undefined
    );
}
