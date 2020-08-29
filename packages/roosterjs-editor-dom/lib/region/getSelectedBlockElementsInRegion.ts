import ContentTraverser from '../contentTraverser/ContentTraverser';
import getSelectionRangeInRegion from './getSelectionRangeInRegion';
import { BlockElement, Region } from 'roosterjs-editor-types';

/**
 * Get all block elements covered by the selection under this region
 */
export default function getSelectedBlockElementsInRegion(region: Region): BlockElement[] {
    const range = getSelectionRangeInRegion(region);
    const blocks: BlockElement[] = [];

    if (range) {
        const { rootNode, skipTags } = region;
        const traverser = ContentTraverser.createSelectionTraverser(rootNode, range, skipTags);

        for (
            let block = traverser?.currentBlockElement;
            !!block;
            block = traverser.getNextBlockElement()
        ) {
            blocks.push(block);
        }
    }

    return blocks;
}
