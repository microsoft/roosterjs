import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { createQuote } from '../creators/createQuote';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelections } from '../selection/getSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function outdent(model: ContentModelDocument) {
    const paragraphs = getSelections(model);
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(paragraphs, [
        'ListItem',
    ]);

    paragraphOrListItem.forEach(item => {
        if (isBlockGroupOfType<ContentModelListItem>(item, 'ListItem')) {
            item.levels.pop();
        } else {
            const parent = item.path[0];
            const grandParent = item.path[1];

            // TODO: Consider use CSS and a particular Content Model type to represent Indent rather than Quote
            if (isBlockGroupOfType<ContentModelQuote>(parent, 'Quote') && grandParent) {
                const index = item.paragraph ? parent.blocks.indexOf(item.paragraph) : -1;
                let grandIndex = grandParent.blocks.indexOf(parent);

                // When there are blocks before current one under the same parent, need to break the parent into two
                if (index > 0) {
                    const newParent = createQuote();

                    newParent.blocks = parent.blocks.splice(0, index);
                    grandParent.blocks.splice(grandIndex, 0, newParent);
                    grandIndex++;
                }

                if (parent.blocks.length > 0) {
                    grandParent.blocks.splice(grandIndex, 0, parent.blocks.shift()!);
                    grandIndex++;

                    if (parent.blocks.length == 0) {
                        grandParent.blocks.splice(grandIndex, 1);
                    }
                }
            }
        }
    });

    return paragraphOrListItem.length > 0;
}
