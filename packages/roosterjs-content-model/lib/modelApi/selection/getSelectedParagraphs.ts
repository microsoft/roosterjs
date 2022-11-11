import hasSelectionInBlock from '../../publicApi/selection/hasSelectionInBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
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

    // Remove tail paragraph if first selection marker is the only selection
    if (result.length > 1 && isOnlySelectionMarkerSelected(result, false /*checkFirstParagraph*/)) {
        result.pop();
    }

    // Remove head paragraph if first selection marker is the only selection
    if (result.length > 1 && isOnlySelectionMarkerSelected(result, true /*checkFirstParagraph*/)) {
        result.shift();
    }

    return result;
}

function isOnlySelectionMarkerSelected(
    paragraphs: SelectedParagraphWithPath[],
    checkFirstParagraph: boolean
): boolean {
    const paragraph = paragraphs[checkFirstParagraph ? 0 : paragraphs.length - 1].paragraph;
    const selectedSegments = paragraph.segments.filter(s => s.isSelected);

    return (
        selectedSegments.length == 1 &&
        selectedSegments[0].segmentType == 'SelectionMarker' &&
        selectedSegments[0] ==
            paragraph.segments[checkFirstParagraph ? paragraph.segments.length - 1 : 0]
    );
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
