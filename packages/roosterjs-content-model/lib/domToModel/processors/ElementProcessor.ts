import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { FormatContext } from '../../formatHandlers/FormatContext';

/**
 * @internal
 */
export type ElementProcessor = (
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: FormatContext
) => void;
