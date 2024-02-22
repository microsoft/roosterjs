import { ContentModelDocument, ContentModelListItem } from 'roosterjs-content-model-types';
import { setModelIndentation } from 'roosterjs-content-model-api';

/**
 * @internal
 */
export function handleTabOnList(
    model: ContentModelDocument,
    listItem: ContentModelListItem,
    rawEvent: KeyboardEvent
) {
    if (isMarkerAtStartOfBlock(listItem)) {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    }
    return false;
}

function isMarkerAtStartOfBlock(listItem: ContentModelListItem) {
    return (
        listItem.blocks[0].blockType == 'Paragraph' &&
        listItem.blocks[0].segments[0].segmentType == 'SelectionMarker'
    );
}
