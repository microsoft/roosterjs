import type { CoreEditorCore } from '../editor/CoreEditorCore';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 * Set current DOM selection from editor. This is the replacement of core API select
 * @param core The CoreEditorCore object
 * @param selection The selection to set
 */
export type SetDOMSelection = (core: CoreEditorCore, selection: DOMSelection) => void;
