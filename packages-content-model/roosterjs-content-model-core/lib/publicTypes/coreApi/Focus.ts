import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * @internal
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The CoreEditorCore object
 */
export type Focus = (core: CoreEditorCore) => void;
