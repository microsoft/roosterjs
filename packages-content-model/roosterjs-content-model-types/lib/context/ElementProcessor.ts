import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { DomToModelContext } from './DomToModelContext';

/**
 * A function type to process HTML element when do DOM to Content Model conversion
 * @param group Parent content model group
 * @param element The element to process
 * @param context The context object to provide related information
 */
export type ElementProcessor<T extends Node> = (
    group: ContentModelBlockGroup,
    element: T,
    context: DomToModelContext
) => void;
