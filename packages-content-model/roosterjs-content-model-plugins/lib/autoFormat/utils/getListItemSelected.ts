import { ContentModelDocument, ContentModelListItem } from 'roosterjs-content-model-types';
import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';

export const getSelectedListItem = (model: ContentModelDocument) => {
    const blocks = getOperationalBlocks(model, ['ListItem'], ['TableCell']);
    const lisItem = blocks.filter(({ block, parent }) => {
        return (
            isBlockGroupOfType<ContentModelListItem>(block, 'ListItem') &&
            parent.blocks.indexOf(block) > -1
        );
    });
    return lisItem.length == 1 ? lisItem[0].block : undefined;
};
