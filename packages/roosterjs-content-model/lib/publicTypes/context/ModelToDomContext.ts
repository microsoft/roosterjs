import { EditorContext } from './EditorContext';
import { ModelToDomSelectionContext } from './ModelToDomSelectionContext';

/**
 * Context of Model to DOM conversion, used for generate HTML DOM tree according to current context
 */
export interface ModelToDomContext extends EditorContext, ModelToDomSelectionContext {}
