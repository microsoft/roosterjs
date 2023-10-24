import { ContentModelEditorCore } from '../editor/ContentModelEditorCore';
import { EditorContext } from 'roosterjs-content-model-types';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The ContentModelEditorCore object
 */
export type CreateEditorContext = (core: ContentModelEditorCore) => EditorContext;
