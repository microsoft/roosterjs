import { ContentModelEditorCore } from '../editor/ContentModelEditorCore';
import { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Set current DOM selection from editor. This is the replacement of core API select
 * @param core The ContentModelEditorCore object
 * @param selection The selection to set
 */
export type SetDOMSelection = (core: ContentModelEditorCore, selection: DOMSelection) => void;
