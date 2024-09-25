import type { EditorContext } from './EditorContext';
import type { ModelToDomFormatContext } from './ModelToDomFormatContext';
import type { ModelToDomSelectionContext } from './ModelToDomSelectionContext';
import type { ModelToDomSettings } from './ModelToDomSettings';
import type { ModelToDomTextContext } from './ModelToDomTextContext';

/**
 * Context of Model to DOM conversion, used for generate HTML DOM tree according to current context
 */
export interface ModelToDomContext
    extends EditorContext,
        ModelToDomSelectionContext,
        ModelToDomFormatContext,
        ModelToDomSettings,
        ModelToDomTextContext {}
