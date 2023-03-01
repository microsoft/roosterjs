import { DomToModelContext } from './DomToModelContext';

/**
 * A function type that checks if the current element should be skipped when do DOM to Content Model conversion
 * @param group Parent content model group
 * @param element The element to process
 * @param context The context object to provide related information
 */
export type ShouldSkipProcessElement<T extends Node> = (
    element: T,
    context: DomToModelContext
) => boolean;
