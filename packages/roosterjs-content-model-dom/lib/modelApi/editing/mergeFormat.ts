import { getObjectKeys } from 'roosterjs-content-model-dom/lib/domUtils/getObjectKeys';
import { mutateBlock } from '../common/mutate';
import type {
    ContentModelHyperLinkFormat,
    ContentModelSegmentFormat,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
} from 'roosterjs-content-model-types';

// An object to provide keys of required properties of segment format, do NOT use any of its values
const RequiredEmptySegmentFormat: Required<ContentModelSegmentFormat> = {
    backgroundColor: null!,
    fontFamily: null!,
    fontSize: null!,
    fontWeight: null!,
    italic: null!,
    letterSpacing: null!,
    lineHeight: null!,
    strikethrough: null!,
    superOrSubScriptSequence: null!,
    textColor: null!,
    underline: null!,
};
export const KeysOfSegmentFormat = getObjectKeys(RequiredEmptySegmentFormat);

/**
 * @internal
 * @param group the group to merge format
 * @param format the format to merge into the group
 * @param applyDefaultFormatOption whether to merge all or keep source emphasis.
 */
export function mergeFormat(
    group: ReadonlyContentModelBlockGroup,
    format: ContentModelSegmentFormat,
    applyDefaultFormatOption: 'mergeAll' | 'keepSourceEmphasisFormat'
) {
    group.blocks.forEach(block => {
        mergeBlockFormat(applyDefaultFormatOption, block);

        switch (block.blockType) {
            case 'BlockGroup':
                if (block.blockGroupType == 'ListItem') {
                    mutateBlock(block).formatHolder.format = mergeSegmentFormat(
                        applyDefaultFormatOption,
                        format,
                        block.formatHolder.format
                    );
                }
                mergeFormat(block, format, applyDefaultFormatOption);
                break;

            case 'Table':
                block.rows.forEach(row =>
                    row.cells.forEach(cell => {
                        mergeFormat(cell, format, applyDefaultFormatOption);
                    })
                );
                break;

            case 'Paragraph':
                const paragraphFormat = block.decorator?.format || {};
                const paragraph = mutateBlock(block);

                paragraph.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        mergeFormat(segment, format, applyDefaultFormatOption);
                    }

                    segment.format = mergeSegmentFormat(applyDefaultFormatOption, format, {
                        ...paragraphFormat,
                        ...segment.format,
                    });

                    if (segment.link) {
                        segment.link.format = mergeLinkFormat(
                            applyDefaultFormatOption,
                            format,
                            segment.link.format
                        );
                    }
                });

                if (applyDefaultFormatOption === 'keepSourceEmphasisFormat') {
                    delete paragraph.decorator;
                }
                break;
        }
    });
}

function mergeBlockFormat(applyDefaultFormatOption: string, block: ReadonlyContentModelBlock) {
    if (applyDefaultFormatOption == 'keepSourceEmphasisFormat' && block.format.backgroundColor) {
        delete mutateBlock(block).format.backgroundColor;
    }
}

/**
 * Hyperlink format type definition only contains backgroundColor and underline.
 * So create a minimum object with the styles supported in Hyperlink to be used in merge.
 */
function getSegmentFormatInLinkFormat(
    targetFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    const result: ContentModelHyperLinkFormat = {};
    if (targetFormat.backgroundColor) {
        result.backgroundColor = targetFormat.backgroundColor;
    }
    if (targetFormat.underline) {
        result.underline = targetFormat.underline;
    }

    return result;
}
function mergeLinkFormat(
    applyDefaultFormatOption: 'mergeAll' | 'keepSourceEmphasisFormat',
    targetFormat: ContentModelSegmentFormat,
    sourceFormat: ContentModelHyperLinkFormat
) {
    return applyDefaultFormatOption == 'mergeAll'
        ? { ...getSegmentFormatInLinkFormat(targetFormat), ...sourceFormat }
        : {
              // Hyperlink segment format contains other attributes such as LinkFormat
              // so we have to retain them
              ...getFormatWithoutSegmentFormat(sourceFormat),
              // Link format only have Text color, background color, Underline, but only
              // text color + background color should be merged from the target
              ...getSegmentFormatInLinkFormat(targetFormat),
              // Get the semantic format of the source
              ...getSemanticFormat(sourceFormat),
              // The text color of the hyperlink should not be merged and
              // we should always retain the source text color
              ...getHyperlinkTextColor(sourceFormat),
          };
}

function mergeSegmentFormat(
    applyDefaultFormatOption: 'mergeAll' | 'keepSourceEmphasisFormat',
    targetFormat: ContentModelSegmentFormat,
    sourceFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    return applyDefaultFormatOption == 'mergeAll'
        ? { ...targetFormat, ...sourceFormat }
        : {
              ...getFormatWithoutSegmentFormat(sourceFormat),
              ...targetFormat,
              ...getSemanticFormat(sourceFormat),
          };
}

function getSemanticFormat(segmentFormat: ContentModelSegmentFormat): ContentModelSegmentFormat {
    const result: ContentModelSegmentFormat = {};

    const { fontWeight, italic, underline } = segmentFormat;

    if (fontWeight && fontWeight != 'normal') {
        result.fontWeight = fontWeight;
    }
    if (italic) {
        result.italic = italic;
    }
    if (underline) {
        result.underline = underline;
    }

    return result;
}

/**
 * Segment format can also contain other type of metadata, for example in Images/Hyperlink,
 * we want to preserve these properties when merging format
 */
function getFormatWithoutSegmentFormat(
    sourceFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    const resultFormat = {
        ...sourceFormat,
    };
    KeysOfSegmentFormat.forEach(key => delete resultFormat[key]);
    return resultFormat;
}

function getHyperlinkTextColor(sourceFormat: ContentModelHyperLinkFormat) {
    const result: ContentModelHyperLinkFormat = {};
    if (sourceFormat.textColor) {
        result.textColor = sourceFormat.textColor;
    }

    return result;
}
