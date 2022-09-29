import { EditorContext } from './EditorContext';
import { ModelToDomFormatContext } from './ModelToDomFormatContext';
import { ModelToDomSelectionContext } from './ModelToDomSelectionContext';
import { ModelToDomSettings } from './ModelToDomSettings';

/**
 * Context of Model to DOM conversion, used for generate HTML DOM tree according to current context
 */
export interface ModelToDomContext
    extends EditorContext,
        ModelToDomSelectionContext,
        ModelToDomFormatContext,
        ModelToDomSettings {}
