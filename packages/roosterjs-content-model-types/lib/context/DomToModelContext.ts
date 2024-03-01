import type { DomToModelSelectionContext } from './DomToModelSelectionContext';
import type { DomToModelSettings } from './DomToModelSettings';
import type { EditorContext } from './EditorContext';
import type {
    DomToModelFormatContext,
    DomToModelDecoratorContext,
} from './DomToModelFormatContext';

/**
 * Context of DOM to Model conversion, used for parse HTML element according to current context
 */
export interface DomToModelContext
    extends EditorContext,
        DomToModelSelectionContext,
        DomToModelFormatContext,
        DomToModelSettings,
        DomToModelDecoratorContext {}
