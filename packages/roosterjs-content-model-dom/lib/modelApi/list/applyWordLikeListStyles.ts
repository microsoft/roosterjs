import { mutateBlock } from '../common/mutate';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';
import type { ContentModelListItem } from 'roosterjs-content-model-types';

/**
 * @internal
 * Store default Word-like list spacing in the model and retain paragraph wrappers.
 */
export function applyWordLikeListStyles(
    listItem: ContentModelListItem,
    inheritedDirection?: 'ltr' | 'rtl'
) {
    listItem.format.marginBottom = listItem.format.marginBottom ?? '2px';

    listItem.blocks.forEach(block => {
        setParagraphNotImplicit(block);

        const direction =
            block.format.direction ??
            listItem.format.direction ??
            listItem.levels[listItem.levels.length - 1]?.format.direction ??
            inheritedDirection;
        const marginKey = direction == 'rtl' ? 'marginRight' : 'marginLeft';

        if (block.format[marginKey] == undefined) {
            const { format } = mutateBlock(block);

            format[marginKey] = '8px';

            if (direction == 'rtl') {
                format.direction = direction;
            }
        }
    });
}
