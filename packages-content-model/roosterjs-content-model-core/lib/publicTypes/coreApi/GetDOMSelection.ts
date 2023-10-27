import type { EditorCore } from '../editor/EditorCore';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Get current DOM selection from editor
 * @param core The EditorCore object
 * @param forceGetNewSelection True to force get a new range selection from editor UI, otherwise always try get from cache first
 */
export type GetDOMSelection = (
    core: EditorCore,
    forceGetNewSelection: boolean
) => DOMSelection | null;
