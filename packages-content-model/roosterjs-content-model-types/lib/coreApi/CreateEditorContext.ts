import type { CoreEditorCore } from '../editor/CoreEditorCore';
import type { EditorContext } from 'roosterjs-content-model-types';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The CoreEditorCore object
 */
export type CreateEditorContext = (core: CoreEditorCore) => EditorContext;
