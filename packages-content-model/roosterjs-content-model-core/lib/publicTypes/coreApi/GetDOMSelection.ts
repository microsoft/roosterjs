import type { ContentModelEditorCore } from '../editor/ContentModelEditorCore';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Get current DOM selection from editor
 * @param core The ContentModelEditorCore object
 */
export type GetDOMSelection = (core: ContentModelEditorCore) => DOMSelection | null;
