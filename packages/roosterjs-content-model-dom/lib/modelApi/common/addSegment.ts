import { ensureParagraph } from './ensureParagraph';
import type {
    ContentModelBlockFormat,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
    ShallowMutableContentModelBlockGroup,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Add a given segment into a paragraph from its parent group. If the last block of the given group is not paragraph, create a new paragraph.
 * @param group The parent block group of the paragraph to add segment into
 * @param newSegment The segment to add
 * @param blockFormat The block format used for creating a new paragraph when need
 * @returns The parent paragraph where the segment is added to
 */
export function addSegment(
    group: ShallowMutableContentModelBlockGroup,
    newSegment: ContentModelSegment,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat
): ContentModelParagraph;

/**
 * Add a given segment into a paragraph from its parent group. If the last block of the given group is not paragraph, create a new paragraph. (Shallow mutable)
 * @param group The parent block group of the paragraph to add segment into
 * @param newSegment The segment to add
 * @param blockFormat The block format used for creating a new paragraph when need
 * @returns The parent paragraph where the segment is added to
 */
export function addSegment(
    group: ShallowMutableContentModelBlockGroup,
    newSegment: ContentModelSegment,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat
): ShallowMutableContentModelParagraph;

export function addSegment(
    group: ShallowMutableContentModelBlockGroup,
    newSegment: ContentModelSegment,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat
): ShallowMutableContentModelParagraph {
    const paragraph = ensureParagraph(group, blockFormat, segmentFormat);
    const lastSegment = paragraph.segments[paragraph.segments.length - 1];

    if (blockFormat?.textIndent) {
        // For a new paragraph, if current text indent is already applied to previous block in the same level,
        // we need to ignore it according to browser rendering behavior
        if (blockFormat.isTextIndentApplied && paragraph.segments.length == 0) {
            delete paragraph.format.textIndent;
        } else {
            blockFormat.isTextIndentApplied = true;
        }

        delete paragraph.format.isTextIndentApplied;
    }

    if (newSegment.segmentType == 'SelectionMarker') {
        if (!lastSegment || !lastSegment.isSelected || !newSegment.isSelected) {
            paragraph.segments.push(newSegment);
        }
    } else {
        if (
            newSegment.isSelected &&
            lastSegment?.segmentType == 'SelectionMarker' &&
            lastSegment.isSelected
        ) {
            paragraph.segments.pop();
        }

        paragraph.segments.push(newSegment);
    }

    return paragraph;
}
