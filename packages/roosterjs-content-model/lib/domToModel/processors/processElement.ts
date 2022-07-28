import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { FormatContext } from '../../formatHandlers/FormatContext';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { getProcessor } from './getProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';

export function processElement(
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: FormatContext
) {
    const processor =
        getProcessor(element.tagName) ||
        (isBlockElement(element) ? generalBlockProcessor : generalSegmentProcessor);

    processor(group, element, context);
}
