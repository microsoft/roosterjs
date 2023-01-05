import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelQuoteFormat } from '../../publicTypes/format/ContentModelQuoteFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createQuote } from '../creators/createQuote';
import { getOperationalBlocks, OperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import { TypeOfBlockGroup } from '../common/getClosestAncestorBlockGroupIndex';
import { unwrapBlock } from '../common/unwrapBlock';
import { wrapBlockStep1, WrapBlockStep1Result, wrapBlockStep2 } from '../common/wrapBlock';

/**
 * @internal
 */
export function toggleModelBlockQuote(
    model: ContentModelDocument,
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): boolean {
    const paragraphOfQuote = getOperationalBlocks<ContentModelQuote | ContentModelListItem>(
        model,
        ['Quote', 'ListItem'],
        ['TableCell'],
        true /*deepFirst*/
    );

    if (
        areAllOperationalBlocksOfGroupType<
            ContentModelQuote | ContentModelListItem,
            ContentModelQuote
        >(paragraphOfQuote, 'Quote')
    ) {
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
            if (isBlockGroupOfType<ContentModelQuote>(block, 'Quote')) {
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
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): target is ContentModelQuote {
    return (
        isBlockGroupOfType<ContentModelQuote>(target, 'Quote') &&
        areSameFormats(quoteFormat, target.format) &&
        areSameFormats(segmentFormat, target.quoteSegmentFormat)
    );
}

function areAllOperationalBlocksOfGroupType<
    SourceType extends ContentModelBlockGroup,
    ResultType extends SourceType
>(
    blockAndParents: OperationalBlocks<SourceType>[],
    type: TypeOfBlockGroup<ResultType>
): blockAndParents is { block: ResultType; parent: ContentModelBlockGroup }[] {
    return blockAndParents.every(blockAndParent =>
        isBlockGroupOfType<ResultType>(blockAndParent.block, type)
    );
}
