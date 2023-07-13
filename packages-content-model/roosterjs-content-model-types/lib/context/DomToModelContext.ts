import { DomToModelSelectionContext } from './DomToModelSelectionContext';
import { DomToModelSettings } from './DomToModelSettings';
import { EditorContext } from './EditorContext';
import { DomToModelFormatContext, DomToModelDecoratorContext } from './DomToModelFormatContext';

/**
 * Context of DOM to Model conversion, used for parse HTML element according to current context
 */
export interface DomToModelContext
    extends EditorContext,
        DomToModelSelectionContext,
        DomToModelFormatContext,
        DomToModelSettings,
        DomToModelDecoratorContext {}
