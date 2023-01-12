import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelText } from 'roosterjs-content-model/lib/publicTypes/segment/ContentModelText';
import { createText } from 'roosterjs-content-model/lib/modelApi/creators/createText';
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

const PUNCTUATION_REGEX = /[.,:!?()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

/**
 * @internal
 */
export function getSelections(
    group: ContentModelBlockGroup,
    options?: GetSelectionOptions
): ContentModelSelection[] {
    const result: ContentModelSelection[] = [];

    getSelectionsInternal([group], result, options);

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

function getSelectionsInternal(
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
                //let markerSegmentIndex: number = 0;

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
                    if (
                        selectedSegments.length == 1 &&
                        selectedSegments[0].segmentType == 'SelectionMarker'
                    ) {
                        let markerSelectionIndex = block.segments.indexOf(selectedSegments[0]);
                        //selectedSegments.pop();
                        for (let i = markerSelectionIndex - 1; i >= 0; i--) {
                            if (block.segments[i].segmentType == 'Text') {
                                const found = findDelimiter(
                                    block.segments[i] as ContentModelText,
                                    false
                                );
                                if (found != null) {
                                    let blenght = block.segments[i] as ContentModelText;
                                    if (found == blenght.text.length) break;
                                    splitSegment(block.segments as ContentModelText[], i, found);
                                    //block.segments[i + 1].isSelected = true;
                                    selectedSegments.push(block.segments[i + 1]);
                                    break;
                                } else selectedSegments.push(block.segments[i]);
                            } else break;
                        }
                        markerSelectionIndex = block.segments.indexOf(selectedSegments[0]);
                        for (let i = markerSelectionIndex + 1; i < block.segments.length; i++) {
                            if (block.segments[i].segmentType == 'Text') {
                                const found = findDelimiter(
                                    block.segments[i] as ContentModelText,
                                    true
                                );
                                if (found != null) {
                                    if (found == 0) break;
                                    splitSegment(block.segments as ContentModelText[], i, found);
                                    //block.segments[i].isSelected = true;
                                    selectedSegments.push(block.segments[i]);
                                    break;
                                } else selectedSegments.push(block.segments[i]);
                            } else break;
                        }
                        //console.log('>>', selectedSegments);
                        //debugger;
                        result.push({
                            paragraph: block,
                            segments: selectedSegments,
                            path: [...path],
                        });
                    } else {
                        result.push({
                            paragraph: block,
                            segments: selectedSegments,
                            path: [...path],
                        });
                    }
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

function findDelimiter(segment: ContentModelText, moveRightward: boolean): number | null {
    const word = segment.text;
    let offset = null;
    if (moveRightward) {
        for (let i = 0; i < word.length; i++) {
            if (isWordDelimiter(word[i])) {
                offset = i;
                break;
            }
        }
    } else {
        for (let i = word.length - 1; i >= 0; i--) {
            if (isWordDelimiter(word[i])) {
                offset = i + 1;
                break;
            }
        }
    }
    return offset;
}

function splitSegment(segments: ContentModelText[], index: number, found: number) {
    const segment1 = createText(segments[index].text.substring(0, found));
    const segment2 = createText(segments[index].text.substring(found, segments[index].text.length));

    segments.splice(index, 1, segment2);
    segments.splice(index, 0, segment1);
}

function isWordDelimiter(char: string) {
    return PUNCTUATION_REGEX.test(char) || isSpace(char);
}

function isSpace(char: string) {
    return (
        char &&
        (char.toString() == String.fromCharCode(160) /* &nbsp */ ||
        char.toString() == String.fromCharCode(32) /* RegularSpace */ ||
            SPACES_REGEX.test(char))
    );
}

function getSelectedParagraphFromBlockGroup(
    group: ContentModelBlockGroup,
    path: ContentModelBlockGroup[],
    result: ContentModelSelection[],
    options?: GetSelectionOptions,
    treatAllAsSelect?: boolean
) {
    path.unshift(group);
    getSelectionsInternal(path, result, options, treatAllAsSelect);
    path.shift();
}
