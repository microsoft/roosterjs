import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSelection } from './getSelections';

/**
 * @internal
 */
export function findParentGroup(
    block: ContentModelBlock | ContentModelBlockGroup,
    selections: ContentModelSelection[]
): ContentModelBlockGroup | null {
    for (let i = 0; i < selections.length; i++) {
        const selection = selections[i];

        if (selection.paragraph == block) {
            return selection.path[0] || null;
        } else if (isBlockGroup(block)) {
            const index = selection.path.indexOf(block);

            if (index >= 0) {
                return selection.path[index + 1] || null;
            }
        }
    }

    return null;
}

function isBlockGroup(
    block: ContentModelBlock | ContentModelBlockGroup
): block is ContentModelBlockGroup {
    return !!(<ContentModelBlockGroup>block).blockGroupType;
}
