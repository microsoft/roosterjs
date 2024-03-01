import { handleIndentationOnParagraph } from './handleIndentationOnParagraph';
import { setModelIndentation } from 'roosterjs-content-model-api';
import { shouldOutdent } from './shouldOutdent';
import type { ContentModelDocument, ContentModelListItem } from 'roosterjs-content-model-types';

/**
 * 1. When the selection is collapsed and the cursor is at start of a list item, call setModelIndentation.
 * 2. Otherwise call handleTabOnParagraph.
 * @internal
 */
export function handleIndentationOnList(
    model: ContentModelDocument,
    listItem: ContentModelListItem,
    rawEvent: KeyboardEvent
) {
    const selectedParagraph = findSelectedParagraph(listItem);
    if (
        !isMarkerAtStartOfBlock(listItem) &&
        selectedParagraph.length == 1 &&
        selectedParagraph[0].blockType === 'Paragraph'
    ) {
        return handleIndentationOnParagraph(model, selectedParagraph[0], rawEvent);
    } else {
        setModelIndentation(model, shouldOutdent(rawEvent) ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    }
}

function isMarkerAtStartOfBlock(listItem: ContentModelListItem) {
    return (
        listItem.blocks[0].blockType == 'Paragraph' &&
        listItem.blocks[0].segments[0].segmentType == 'SelectionMarker'
    );
}

function findSelectedParagraph(listItem: ContentModelListItem) {
    return listItem.blocks.filter(
        block =>
            block.blockType == 'Paragraph' && block.segments.some(segment => segment.isSelected)
    );
}
