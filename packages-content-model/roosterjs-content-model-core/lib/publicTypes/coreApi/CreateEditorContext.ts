import type { EditorCore } from '../editor/EditorCore';
import type { EditorContext } from 'roosterjs-content-model-types';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The EditorCore object
 */
export type CreateEditorContext = (core: EditorCore) => EditorContext;
