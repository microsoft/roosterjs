import {
    copyFormat,
    createBr,
    createParagraph,
    normalizeParagraph,
    ParagraphFormats,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockFormat,
    InsertPoint,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const DEFAULT_FORMAT_KEYS: Partial<keyof ContentModelBlockFormat>[] = [
    'backgroundColor',
    'direction',
    'textAlign',
    'htmlAlign',
    'lineHeight',
    'textIndent',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
];

/**
 * @internal
 * Split the given paragraph from insert point into two paragraphs,
 * and move the selection marker to the beginning of the second paragraph
 * @param insertPoint The input insert point which includes the paragraph and selection marker
 * @param formatKeys The format that needs to be copied from the splitted paragraph, if not specified,  some default format will be copied
 * @returns The new paragraph it created
 */
export function splitParagraph(
    insertPoint: InsertPoint,
    formatKeys: Partial<keyof ContentModelBlockFormat>[] = DEFAULT_FORMAT_KEYS
) {
    const { paragraph, marker } = insertPoint;
    const newFormat = createNewFormat(paragraph.format, formatKeys);
    const newParagraph: ShallowMutableContentModelParagraph = createParagraph(
        false /*isImplicit*/,
        {},
        paragraph.segmentFormat
    );

    copyFormat(newParagraph.format, paragraph.format, ParagraphFormats);

    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );

    newParagraph.segments.push(...segments);

    if (paragraph.segments.length == 0 && !paragraph.isImplicit) {
        paragraph.segments.push(createBr(marker.format));
    } else if (paragraph.segments.length > 0) {
        setParagraphNotImplicit(paragraph);
    }

    insertPoint.paragraph = newParagraph;

    normalizeParagraph(paragraph);

    return newParagraph;
}

const createNewFormat = (
    format: ContentModelBlockFormat,
    formatKeys: Partial<keyof ContentModelBlockFormat>[]
) => {
    let newFormat: ContentModelBlockFormat = {};
    for (const key of formatKeys) {
        if (format[key]) {
            newFormat = {
                ...newFormat,
                [key]: format[key],
            };
        }
    }
    return newFormat;
};
