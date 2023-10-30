import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export type RestoreUndoSnapshot = (core: CoreEditorCore, step: number) => void;
