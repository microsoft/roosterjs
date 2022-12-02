import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelQuoteFormat } from '../../publicTypes/format/ContentModelQuoteFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createQuote } from '../creators/createQuote';
import { findParentGroup } from '../selection/findParentGroup';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelections } from '../selection/getSelections';
import { unwrapBlock } from '../common/unwrapBlock';
import { wrapBlockStep1, WrapBlockStep1Result, wrapBlockStep2 } from '../common/wrapBlock';
import {
    areAllOperationalBlocksOfGroupType,
    isBlockGroupOfType,
} from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function toggleModelBlockQuote(
    model: ContentModelDocument,
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): boolean {
    const selections = getSelections(model);
    const paragraphOfQuote = getOperationalBlocks<ContentModelQuote | ContentModelListItem>(
        selections,
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
        paragraphOfQuote.forEach(item => {
            unwrapBlock(findParentGroup(item, selections), item);
        });
    } else {
        const step1Results: WrapBlockStep1Result<ContentModelQuote>[] = [];
        const creator = () => createQuote(quoteFormat, segmentFormat);
        const canMerge = (
            target: Object | null | undefined,
            current?: ContentModelQuote
        ): target is ContentModelQuote =>
            canMergeQuote(
                target,
                current?.format || quoteFormat,
                current?.quoteSegmentFormat || segmentFormat
            );

        paragraphOfQuote.forEach(item => {
            if (isBlockGroupOfType<ContentModelQuote>(item, 'Quote')) {
                // Already in quote, no op
            } else if (isBlockGroupOfType<ContentModelListItem>(item, 'ListItem')) {
                const parentGroup = findParentGroup(item, selections);

                wrapBlockStep1(step1Results, parentGroup, item, creator, canMerge);
            } else if (item.paragraph) {
                wrapBlockStep1(step1Results, item.path[0], item.paragraph, creator, canMerge);
            }
        });

        wrapBlockStep2(step1Results, canMerge);
    }

    return paragraphOfQuote.length > 0;
}

function canMergeQuote(
    target: Object | null | undefined,
    quoteFormat: ContentModelQuoteFormat,
    segmentFormat: ContentModelSegmentFormat
): target is ContentModelQuote {
    return (
        isBlockGroupOfType<ContentModelQuote>(target, 'Quote') &&
        areSameFormats(quoteFormat, target.format) &&
        areSameFormats(segmentFormat, target.quoteSegmentFormat)
    );
}
