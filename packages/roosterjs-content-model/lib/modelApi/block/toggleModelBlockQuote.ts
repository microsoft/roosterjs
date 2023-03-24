import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createQuote } from '../creators/createQuote';
import { getOperationalBlocks, OperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import { unwrapBlock } from '../common/unwrapBlock';
import { wrapBlockStep1, WrapBlockStep1Result, wrapBlockStep2 } from '../common/wrapBlock';

/**
 * @internal
 */
export function toggleModelBlockQuote(
    model: ContentModelDocument,
    quoteFormat: ContentModelBlockFormat,
    segmentFormat: ContentModelSegmentFormat
): boolean {
    const paragraphOfQuote = getOperationalBlocks<ContentModelQuote | ContentModelListItem>(
        model,
        ['FormatContainer', 'ListItem'],
        ['TableCell'],
        true /*deepFirst*/
    );

    if (areAllBlockQuotes(paragraphOfQuote)) {
        // All selections are already in quote, we need to unquote them
        paragraphOfQuote.forEach(({ block, parent }) => {
            unwrapBlock(parent, block);
        });
    } else {
        const step1Results: WrapBlockStep1Result<ContentModelQuote>[] = [];
        const creator = () => createQuote(quoteFormat, segmentFormat);
        const canMerge = (
            target: ContentModelBlock,
            current?: ContentModelQuote
        ): target is ContentModelQuote =>
            canMergeQuote(
                target,
                current?.format || quoteFormat,
                current?.quoteSegmentFormat || segmentFormat
            );

        paragraphOfQuote.forEach(({ block, parent }) => {
            if (isQuote(block)) {
                // Already in quote, no op
            } else {
                wrapBlockStep1(step1Results, parent, block, creator, canMerge);
            }
        });

        wrapBlockStep2(step1Results, canMerge);
    }

    return paragraphOfQuote.length > 0;
}

function canMergeQuote(
    target: ContentModelBlock,
    quoteFormat: ContentModelBlockFormat,
    segmentFormat: ContentModelSegmentFormat
): target is ContentModelQuote {
    return (
        isQuote(target) &&
        areSameFormats(quoteFormat, target.format) &&
        areSameFormats(segmentFormat, target.quoteSegmentFormat)
    );
}

function isQuote(block: ContentModelBlock): block is ContentModelQuote {
    return (
        isBlockGroupOfType<ContentModelFormatContainer>(block, 'FormatContainer') &&
        block.tagName == 'blockquote'
    );
}

function areAllBlockQuotes(
    blockAndParents: OperationalBlocks<ContentModelQuote | ContentModelListItem>[]
): blockAndParents is { block: ContentModelQuote; parent: ContentModelBlockGroup }[] {
    return blockAndParents.every(
        blockAndParent =>
            isBlockGroupOfType<ContentModelQuote>(blockAndParent.block, 'FormatContainer') &&
            blockAndParent.block.tagName == 'blockquote'
    );
}
