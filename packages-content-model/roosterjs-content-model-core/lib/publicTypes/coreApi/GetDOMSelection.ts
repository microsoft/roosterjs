import type { CoreEditorCore } from '../editor/CoreEditorCore';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get current DOM selection from editor
 * @param core The CoreEditorCore object
 * @param forceGetNewSelection True to force get a new range selection from editor UI, otherwise always try get from cache first
 */
export type GetDOMSelection = (
    core: CoreEditorCore,
    forceGetNewSelection: boolean
) => DOMSelection | null;
