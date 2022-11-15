import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 */
export interface ContentModelSelection {
    /**
     * Paragraph that contains selection.
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    paragraph: ContentModelParagraph | null;

    /**
     * Selected segments
     *
     * When GetSelectionOptions.includeFormatHolder is passed into getSelections(), it is possible paragraph is null when there are
     * selections that are not directly under a paragraph, in that case the segments will contains formatHolder segment.
     */
    segments: ContentModelSegment[];

    /**
     * A path that combines all parents of ContentModelBlockGroup of this paragraph. First element is the direct parent group, then next
     * one is first one's parent group, until last one, the root document group.
     * e.g. A table contains a list with a paragraph, like:
     * ContentModelDocument
     *   \ ContentModelTable
     *       \ ContentModelListItem
     *           \ ContentModelParagraph
     * Then the path will be:
     * [ContentModelListItem, ContentModelDocument]
     */
    path: ContentModelBlockGroup[];
}

/**
 * @internal
 */
export interface GetSelectionOptions {
    /**
     * When pass true, format holder (e.g. ContentModelListItem.formatHolder) is also included in selected segment in result.
     */
    includeFormatHolder?: boolean;

    /**
     * When pass true, if selection is started from the end of a paragraph, or ended at the beginning of a paragraph,
     * those paragraphs are also included in result
     */
    includeUnmeaningfulSelectedParagraph?: boolean;
}

/**
 * @internal
 */
export function getSelections(
    group: ContentModelBlockGroup,
    options?: GetSelectionOptions
): ContentModelSelection[] {
    const result: ContentModelSelection[] = [];

    getSelectedParagraphsInternal([group], result, options);

    if (!options || !options.includeUnmeaningfulSelectedParagraph) {
        // Remove tail paragraph if first selection marker is the only selection
        if (
            result.length > 1 &&
            isOnlySelectionMarkerSelected(result, false /*checkFirstParagraph*/)
        ) {
            result.pop();
        }

        // Remove head paragraph if first selection marker is the only selection
        if (
            result.length > 1 &&
            isOnlySelectionMarkerSelected(result, true /*checkFirstParagraph*/)
        ) {
            result.shift();
        }
    }

    return result;
}

function isOnlySelectionMarkerSelected(
    paragraphs: ContentModelSelection[],
    checkFirstParagraph: boolean
): boolean {
    const paragraph = paragraphs[checkFirstParagraph ? 0 : paragraphs.length - 1].paragraph;

    if (!paragraph) {
        return false;
    } else {
        const selectedSegments = paragraph.segments.filter(s => s.isSelected);

        return (
            selectedSegments.length == 1 &&
            selectedSegments[0].segmentType == 'SelectionMarker' &&
            selectedSegments[0] ==
                paragraph.segments[checkFirstParagraph ? paragraph.segments.length - 1 : 0]
        );
    }
}

function getSelectedParagraphsInternal(
    path: ContentModelBlockGroup[],
    result: ContentModelSelection[],
    options?: GetSelectionOptions,
    treatAllAsSelect?: boolean
) {
    const parent = path[0];
    let hasUnselectedSegment = false;
    let startingLength = result.length;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                getSelectedParagraphFromBlockGroup(block, path, result, options, treatAllAsSelect);
                break;

            case 'Table':
                block.cells.forEach(row => {
                    row.forEach(cell => {
                        getSelectedParagraphFromBlockGroup(
                            cell,
                            path,
                            result,
                            options,
                            treatAllAsSelect || cell.isSelected
                        );
                    });
                });
                break;

            case 'Paragraph':
                const selectedSegments: ContentModelSegment[] = [];

                block.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        getSelectedParagraphFromBlockGroup(
                            segment,
                            path,
                            result,
                            options,
                            treatAllAsSelect
                        );
                    } else if (treatAllAsSelect || segment.isSelected) {
                        selectedSegments.push(segment);
                    } else {
                        hasUnselectedSegment = true;
                    }
                });

                if (selectedSegments.length > 0) {
                    result.push({
                        paragraph: block,
                        segments: selectedSegments,
                        path: [...path],
                    });
                }

                break;
        }
    }

    if (
        parent.blockGroupType == 'ListItem' &&
        !hasUnselectedSegment &&
        options?.includeFormatHolder
    ) {
        result.splice(startingLength, 0 /*deleteCount*/, {
            paragraph: null,
            segments: [parent.formatHolder],
            path: [...path],
        });
    }
}

function getSelectedParagraphFromBlockGroup(
    group: ContentModelBlockGroup,
    path: ContentModelBlockGroup[],
    result: ContentModelSelection[],
    options?: GetSelectionOptions,
    treatAllAsSelect?: boolean
) {
    path.unshift(group);
    getSelectedParagraphsInternal(path, result, options, treatAllAsSelect);
    path.shift();
}
