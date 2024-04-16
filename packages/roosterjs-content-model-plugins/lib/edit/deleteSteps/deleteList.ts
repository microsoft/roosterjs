import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-dom';
import type { DeleteSelectionStep, ContentModelListItem } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteList: DeleteSelectionStep = context => {
    if (context.deleteResult != 'notDeleted') {
        return;
    }

    const { paragraph, marker, path } = context.insertPoint;

    if (paragraph.segments[0] == marker) {
        const index = getClosestAncestorBlockGroupIndex<ContentModelListItem>(
            path,
            ['ListItem'],
            ['TableCell', 'FormatContainer']
        );
        const item = path[index] as ContentModelListItem | undefined;
        const lastLevel = item?.levels[item.levels.length - 1];

        if (lastLevel && item?.blocks[0] == paragraph) {
            if (lastLevel.format.displayForDummyItem == 'block') {
                item.levels.pop();
            } else {
                lastLevel.format.displayForDummyItem = 'block';
            }

            context.deleteResult = 'range';
        }
    }
};
