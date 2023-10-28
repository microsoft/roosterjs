import type { EditorContext } from 'roosterjs-content-model-types';
import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 * @param core The CoreEditorCore object
 */
export type CreateEditorContext = (core: CoreEditorCore) => EditorContext;
