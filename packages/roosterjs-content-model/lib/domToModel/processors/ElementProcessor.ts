import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export type ElementProcessor = (
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext
) => void;
