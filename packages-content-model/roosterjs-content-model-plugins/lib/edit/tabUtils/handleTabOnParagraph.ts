import { createSelectionMarker, createText } from 'roosterjs-content-model-dom';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    RangeSelection,
} from 'roosterjs-content-model-types';

const tabSpaces = '    ';
const space = ' ';

/**
 * @internal
 */
export function handleTabOnParagraph(
    model: ContentModelDocument,
    paragraph: ContentModelParagraph,
    rawEvent: KeyboardEvent,
    selection: RangeSelection
) {
    if (paragraph.segments[0].segmentType === 'SelectionMarker' && selection.range.collapsed) {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
    } else {
        const markerIndex = paragraph.segments.findIndex(
            segment => segment.segmentType === 'SelectionMarker'
        );
        if (!selection.range.collapsed) {
            let firstSelectedSegmentIndex: number | undefined = undefined;
            let lastSelectedSegmentIndex: number | undefined = undefined;

            paragraph.segments.forEach((segment, index) => {
                if (segment.isSelected) {
                    if (!firstSelectedSegmentIndex) {
                        firstSelectedSegmentIndex = index;
                    }
                    lastSelectedSegmentIndex = index;
                }
            });
            if (firstSelectedSegmentIndex && lastSelectedSegmentIndex) {
                const firstSelectedSegment = paragraph.segments[firstSelectedSegmentIndex];
                const spaceText = createText(rawEvent.shiftKey ? tabSpaces : space);
                const marker = createSelectionMarker(firstSelectedSegment.format);
                paragraph.segments.splice(
                    firstSelectedSegmentIndex,
                    lastSelectedSegmentIndex - firstSelectedSegmentIndex + 1,
                    spaceText,
                    marker
                );
            } else {
                return false;
            }
        } else {
            if (!rawEvent.shiftKey) {
                const tabText = createText(tabSpaces);
                paragraph.segments.splice(markerIndex, 0, tabText);
            } else {
                const tabText = paragraph.segments[markerIndex - 1];
                const tabSpacesLength = tabSpaces.length;
                if (tabText.segmentType == 'Text') {
                    const tabSpaceTextLength = tabText.text.length - tabSpacesLength;
                    if (tabText.text === tabSpaces) {
                        paragraph.segments.splice(markerIndex - 1, 1);
                    } else if (tabText.text.substring(tabSpaceTextLength) === tabSpaces) {
                        tabText.text = tabText.text.substring(0, tabSpaceTextLength);
                    } else {
                        return false;
                    }
                }
            }
        }
    }

    rawEvent.preventDefault();
    return true;
}
