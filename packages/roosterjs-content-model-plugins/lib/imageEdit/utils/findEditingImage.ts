import type { ReadonlyContentModelBlockGroup } from 'roosterjs-content-model-types';
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
                                (segment.dataset.isEditing && !imageId) ||
                                segment.format.id == imageId
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
        }
    }

    return null;
}
