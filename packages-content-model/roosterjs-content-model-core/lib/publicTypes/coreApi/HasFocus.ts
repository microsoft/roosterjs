import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * @internal
 * Check if the editor has focus now
 * @param core The CoreEditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export type HasFocus = (core: CoreEditorCore) => boolean;
