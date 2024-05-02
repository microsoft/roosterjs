import { createSelectionMarker, createText } from 'roosterjs-content-model-dom';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

const tabSpaces = '    ';
const space = ' ';

/**
 * @internal
 The handleTabOnParagraph function will handle the tab key in following scenarios:
 * 1. When the selection is collapsed and the cursor is at the end of a paragraph, add 4 spaces.
 * 2. When the selection is collapsed and the cursor is at the start of a paragraph, call setModelIndention function to indent the whole paragraph
 * 3. When the selection is collapsed and the cursor is at the middle of a paragraph, add 4 spaces.
 * 4. When the selection is not collapsed, replace the selected range with a single space.
 * 5. When the selection is not collapsed, but all segments are selected, call setModelIndention function to indent the whole paragraph
 The handleTabOnParagraph function will handle the shift + tab key in a indented paragraph in following scenarios:
 * 1. When the selection is collapsed and the cursor is at the end of a paragraph, remove 4 spaces.
 * 2. When the selection is collapsed and the cursor is at the start of a paragraph, call setModelIndention function to outdent the whole paragraph
 * 3. When the selection is collapsed and the cursor is at the middle of a paragraph, remove 4 spaces.
 * 4. When the selection is not collapsed, replace the selected range with a 4 space.
 * 5. When the selection is not collapsed, but all segments are selected, call setModelIndention function to outdent the whole paragraph
 */
export function handleTabOnParagraph(
    model: ContentModelDocument,
    paragraph: ContentModelParagraph,
    rawEvent: KeyboardEvent,
    context?: FormatContentModelContext
) {
    const selectedSegments = paragraph.segments.filter(segment => segment.isSelected);
    const isCollapsed =
        selectedSegments.length === 1 && selectedSegments[0].segmentType === 'SelectionMarker';
    const isAllSelected = paragraph.segments.every(segment => segment.isSelected);
    if ((paragraph.segments[0].segmentType === 'SelectionMarker' && isCollapsed) || isAllSelected) {
        const { marginLeft, marginRight, direction } = paragraph.format;
        const isRtl = direction === 'rtl';
        if (
            rawEvent.shiftKey &&
            ((!isRtl && (!marginLeft || marginLeft == '0px')) ||
                (isRtl && (!marginRight || marginRight == '0px')))
        ) {
            return false;
        }
        setModelIndentation(
            model,
            rawEvent.shiftKey ? 'outdent' : 'indent',
            undefined /*length*/,
            context
        );
    } else {
        if (!isCollapsed) {
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
                const spaceText = createText(
                    rawEvent.shiftKey ? tabSpaces : space,
                    firstSelectedSegment.format
                );
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
            const markerIndex = paragraph.segments.findIndex(
                segment => segment.segmentType === 'SelectionMarker'
            );
            if (!rawEvent.shiftKey) {
                const markerFormat = paragraph.segments[markerIndex].format;
                const tabText = createText(tabSpaces, markerFormat);
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
