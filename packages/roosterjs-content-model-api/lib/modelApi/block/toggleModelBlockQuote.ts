import { splitSelectedParagraphByBr } from './splitSelectedParagraphByBr';
import { wrapBlockStep1, wrapBlockStep2 } from '../common/wrapBlock';
import {
    getOperationalBlocks,
    isBlockGroupOfType,
    areSameFormats,
    createFormatContainer,
    unwrapBlock,
} from 'roosterjs-content-model-dom';
import type { WrapBlockStep1Result } from '../common/wrapBlock';
import type {
    ContentModelBlockGroup,
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
    ContentModelListItem,
    ReadonlyContentModelBlock,
    ReadonlyContentModelDocument,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelListItem,
    ReadonlyOperationalBlocks,
    ShallowMutableContentModelBlock,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function toggleModelBlockQuote(
    model: ReadonlyContentModelDocument,
    formatLtr: ContentModelFormatContainerFormat,
    formatRtl: ContentModelFormatContainerFormat
): boolean {
    splitSelectedParagraphByBr(model);

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
            target: ShallowMutableContentModelBlock,
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
    target: ShallowMutableContentModelBlock,
    format: ContentModelFormatContainerFormat
): target is ContentModelFormatContainer {
    return isQuote(target) && areSameFormats(format, target.format);
}

function isQuote(block: ReadonlyContentModelBlock): block is ReadonlyContentModelFormatContainer {
    return (
        isBlockGroupOfType<ContentModelFormatContainer>(block, 'FormatContainer') &&
        block.tagName == 'blockquote'
    );
}

function areAllBlockQuotes(
    blockAndParents: ReadonlyOperationalBlocks<
        ReadonlyContentModelFormatContainer | ReadonlyContentModelListItem
    >[]
): blockAndParents is {
    block: ContentModelFormatContainer;
    parent: ContentModelBlockGroup;
    path: ContentModelBlockGroup[];
}[] {
    return blockAndParents.every(blockAndParent => isQuote(blockAndParent.block));
}
