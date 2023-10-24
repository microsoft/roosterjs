import { ContentModelEditorCore } from '../editor/ContentModelEditorCore';
import { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Get current DOM selection from editor
 * @param core The ContentModelEditorCore object
 */
export type GetDOMSelection = (core: ContentModelEditorCore) => DOMSelection | null;
