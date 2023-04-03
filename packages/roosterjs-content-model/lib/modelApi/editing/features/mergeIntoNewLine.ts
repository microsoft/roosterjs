import { ContentModelListItem } from '../../../publicTypes/group/ContentModelListItem';
import { DeleteSelectionStep } from '../DeleteSelectionStep';
import { getClosestAncestorBlockGroupIndex } from '../../common/getClosestAncestorBlockGroupIndex';

/**
 * @internal
 */
export const mergeInNewLine: DeleteSelectionStep = (context, options) => {
    const insertPoint = context.insertPoint;

    if (!context.isChanged && insertPoint) {
        const { paragraph, marker, path } = insertPoint;

        const index = paragraph.segments.indexOf(marker);
        const listPathIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell']);
        const list = path[listPathIndex] as ContentModelListItem;
        const level = list?.levels[list.levels.length - 1];

        if (index == 0 && level && list?.blocks[0] == paragraph) {
            const listParent = insertPoint.path[listPathIndex + 1];
            const listIndex = listParent.blocks.indexOf(list);

            if (listIndex > 0 && !level.displayForDummyItem) {
                level.displayForDummyItem = 'block'; // make it as a dummy list item so it will not have list number or bullet
            } else {
                list.levels.pop();
            }

            context.isChanged = true;
        }
    }
};
