import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * A function type to process HTML element when do DOM to Content Model conversion in Paste Event.
 * If the function returns true, means that the element processing was handled by the function.
 * @param group Parent content model group
 * @param element The element to process
 * @param context The context object to provide related information
 */

export type PasteElementProcessor<T extends Node> = (
    group: ContentModelBlockGroup,
    element: T,
    context: DomToModelContext
) => boolean;
