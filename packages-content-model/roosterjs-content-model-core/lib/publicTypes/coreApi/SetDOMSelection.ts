import type { EditorCore } from '../editor/EditorCore';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Set current DOM selection from editor. This is the replacement of core API select
 * @param core The EditorCore object
 * @param selection The selection to set
 */
export type SetDOMSelection = (core: EditorCore, selection: DOMSelection) => void;
