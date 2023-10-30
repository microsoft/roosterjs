import type { ChangeSource, ContentChangedData } from 'roosterjs-content-model-types';
import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * @internal
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The CoreEditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param additionalData Optional parameter to provide additional data related to the ContentChanged Event.
 */
export type AddUndoSnapshot = (
    core: CoreEditorCore,
    callback: (() => any) | null,
    changeSource: ChangeSource | string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData
) => void;
