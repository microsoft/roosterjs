import { wrapBlockStep1, wrapBlockStep2 } from '../common/wrapBlock';
import {
    areSameFormats,
    createFormatContainer,
    getOperationalBlocks,
    isBlockGroupOfType,
    unwrapBlock,
} from 'roosterjs-content-model-dom';
import type { WrapBlockStep1Result } from '../common/wrapBlock';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
    ContentModelListItem,
    OperationalBlocks,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function toggleModelBlockQuote(
    model: ContentModelDocument,
    formatLtr: ContentModelFormatContainerFormat,
    formatRtl: ContentModelFormatContainerFormat
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
        const creator = (isRtl: boolean) =>
            createFormatContainer('blockquote', isRtl ? formatRtl : formatLtr);
        const canMerge = (
            isRtl: boolean,
            target: ContentModelBlock,
            current?: ContentModelFormatContainer
        ): target is ContentModelFormatContainer =>
            canMergeQuote(target, current?.format || (isRtl ? formatRtl : formatLtr));

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
): blockAndParents is {
    block: ContentModelFormatContainer;
    parent: ContentModelBlockGroup;
    path: ContentModelBlockGroup[];
}[] {
    return blockAndParents.every(blockAndParent => isQuote(blockAndParent.block));
}
