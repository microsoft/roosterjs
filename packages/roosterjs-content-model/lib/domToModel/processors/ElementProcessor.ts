import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { FormatContext } from '../../publicTypes/format/FormatContext';

/**
 * @internal
 */
export type ElementProcessor = (
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: FormatContext
) => void;
