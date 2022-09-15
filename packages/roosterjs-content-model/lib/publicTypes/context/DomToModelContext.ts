import { DomToModelFormatContext } from './DomToModelFormatContext';
import { DomToModelSelectionContext } from './DomToModelSelectionContext';
import { DomToModelSettings } from './DomToModelSettings';
import { EditorContext } from './EditorContext';

/**
 * Context of DOM to Model conversion, used for parse HTML element according to current context
 */
export interface DomToModelContext
    extends EditorContext,
        DomToModelSelectionContext,
        DomToModelFormatContext,
        DomToModelSettings {}
