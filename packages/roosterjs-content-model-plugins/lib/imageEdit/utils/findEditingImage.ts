import type {
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelTable,
} from 'roosterjs-content-model-types';
import type { ImageAndParagraph } from '../types/ImageAndParagraph';

/**
 * @internal
 */
export function findEditingImage(
    group: ReadonlyContentModelBlockGroup,
    imageId?: string
): ImageAndParagraph | null {
    for (let i = 0; i < group.blocks.length; i++) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                const result = findEditingImage(block, imageId);

                if (result) {
                    return result;
                }
                break;

            case 'Paragraph':
                for (let j = 0; j < block.segments.length; j++) {
                    const segment = block.segments[j];
                    switch (segment.segmentType) {
                        case 'Image':
                            if (
                                (imageId && segment.format.id == imageId) ||
                                segment.dataset.isEditing
                            ) {
                                return {
                                    paragraph: block,
                                    image: segment,
                                };
                            }
                            break;

                        case 'General':
                            const result = findEditingImage(segment, imageId);

                            if (result) {
                                return result;
                            }
                            break;
                    }
                }
                break;
            case 'Table':
                const imageInTable = findEditingImageOnTable(block, imageId);

                if (imageInTable) {
                    return imageInTable;
                }
                break;
        }
    }

    return null;
}

const findEditingImageOnTable = (table: ReadonlyContentModelTable, imageId?: string) => {
    for (const row of table.rows) {
        for (const cell of row.cells) {
            const result = findEditingImage(cell, imageId);
            if (result) {
                return result;
            }
        }
    }
    return null;
};
