import type { ContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { DomToModelContext } from './DomToModelContext';

/**
 * A function type to process HTML element when do DOM to Content Model conversion
 * @param group Parent content model group
 * @param element The element to process
 * @param context The context object to provide related information
 * @param options Additional options for the processor (optional)
 */
export type ElementProcessor<T extends Node, TOptions = any> = (
    group: ContentModelBlockGroup,
    element: T,
    context: DomToModelContext,
    processNonVisibleElements?: boolean,
    options?: TOptions
) => void;
