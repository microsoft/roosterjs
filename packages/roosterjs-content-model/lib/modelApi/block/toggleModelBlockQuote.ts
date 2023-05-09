import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelFormatContainerFormat } from '../../publicTypes/format/ContentModelFormatContainerFormat';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
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
    format: ContentModelFormatContainerFormat
): boolean {
    const paragraphOfQuote = getOperationalBlocks<
        ContentModelFormatContainer | ContentModelListItem
    >(model, ['FormatContainer', 'ListItem'], ['TableCell'], true /*deepFirst*/);

    if (areAllBlockQuotes(paragraphOfQuote)) {
        // All selections are already in quote, we need to unquote them
        paragraphOfQuote.forEach(({ block, parent }) => {
            unwrapBlock(parent, block);
        });
    } else {
        const step1Results: WrapBlockStep1Result<ContentModelFormatContainer>[] = [];
        const creator = () => createQuote(format);
        const canMerge = (
            target: ContentModelBlock,
            current?: ContentModelFormatContainer
        ): target is ContentModelFormatContainer =>
            canMergeQuote(target, current?.format || format);

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
    format: ContentModelFormatContainerFormat
): target is ContentModelFormatContainer {
    return isQuote(target) && areSameFormats(format, target.format);
}

function isQuote(block: ContentModelBlock): block is ContentModelFormatContainer {
    return (
        isBlockGroupOfType<ContentModelFormatContainer>(block, 'FormatContainer') &&
        block.tagName == 'blockquote'
    );
}

function areAllBlockQuotes(
    blockAndParents: OperationalBlocks<ContentModelFormatContainer | ContentModelListItem>[]
): blockAndParents is { block: ContentModelFormatContainer; parent: ContentModelBlockGroup }[] {
    return blockAndParents.every(blockAndParent => isQuote(blockAndParent.block));
}
