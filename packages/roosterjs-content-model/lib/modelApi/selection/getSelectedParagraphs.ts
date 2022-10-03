import hasSelectionInBlock from '../../publicApi/selection/hasSelectionInBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';

/**
 * @internal
 */
export interface SelectedParagraphWithPath {
    paragraph: ContentModelParagraph;
    path: ContentModelBlockGroup[];
}

/**
 * @internal
 */
export function getSelectedParagraphs(group: ContentModelBlockGroup): SelectedParagraphWithPath[] {
    const result: SelectedParagraphWithPath[] = [];

    getSelectedParagraphsInternal([group], result);

    return result;
}

function getSelectedParagraphsInternal(
    path: ContentModelBlockGroup[],
    result: SelectedParagraphWithPath[],
    treatAllAsSelect?: boolean
) {
    const parent = path[0];

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                path.unshift(block);
                getSelectedParagraphsInternal(path, result, treatAllAsSelect);
                path.shift();
                break;

            case 'Table':
                block.cells.forEach(row => {
                    row.forEach(cell => {
                        path.unshift(cell);
                        getSelectedParagraphsInternal(
                            path,
                            result,
                            treatAllAsSelect || cell.isSelected
                        );
                        path.shift();
                    });
                });
                break;

            case 'Paragraph':
                if (treatAllAsSelect || hasSelectionInBlock(block)) {
                    result.push({
                        paragraph: block,
                        path: [...path],
                    });
                }
                break;
        }
    }
}
