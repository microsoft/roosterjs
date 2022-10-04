import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/block/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/block/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ContentModelQuote } from '../../publicTypes/block/group/ContentModelQuote';
import { createQuote } from '../creators/createQuote';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelectedParagraphs } from '../selection/getSelectedParagraphs';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function indent(model: ContentModelDocument) {
    const paragraphs = getSelectedParagraphs(model);
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(paragraphs, [
        'ListItem',
    ]);

    let quoteInfo: TempQuoteInfo | undefined;

    paragraphOrListItem.forEach(item => {
        if (isBlockGroupOfType(item, 'ListItem')) {
            const newLevel: ContentModelListItemLevelFormat = {
                ...item.levels[item.levels.length - 1],
            };

            // New level is totally new, no need to have these attributes for now
            delete newLevel.startNumberOverride;
            delete newLevel.orderedStyleType;
            delete newLevel.unorderedStyleType;

            item.levels.push(newLevel);

            commitQuote(quoteInfo);
            quoteInfo = undefined;
        } else {
            if (
                !quoteInfo ||
                quoteInfo.parentGroup != item.path[0] ||
                quoteInfo.parentGroup.blocks[quoteInfo.deleteIndex + quoteInfo.itemsToDelete] !=
                    item.paragraph
            ) {
                commitQuote(quoteInfo);

                // TODO: Consider use CSS and a particular Content Model type to represent Indent rather than Quote
                quoteInfo = {
                    parentGroup: item.path[0],
                    quote: createQuote(),
                    deleteIndex: item.path[0].blocks.indexOf(item.paragraph),
                    itemsToDelete: 0,
                };
            }

            quoteInfo.quote.blocks.push(item.paragraph);
            quoteInfo.itemsToDelete++;
        }
    });

    commitQuote(quoteInfo);

    return paragraphOrListItem.length > 0;
}

interface TempQuoteInfo {
    parentGroup: ContentModelBlockGroup;
    quote: ContentModelQuote;
    itemsToDelete: number;
    deleteIndex: number;
}

function commitQuote(quoteInfo?: TempQuoteInfo) {
    if (quoteInfo) {
        const { parentGroup, deleteIndex, itemsToDelete, quote } = quoteInfo;

        parentGroup.blocks.splice(deleteIndex, itemsToDelete, quote);
    }
}
