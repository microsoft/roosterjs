import { containerProcessor } from './processors/containerProcessor';
import { ContentModelBlock } from '../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelBlockType } from '../publicTypes/enum/BlockType';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { ContentModelSegment } from '../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../publicTypes/enum/SegmentType';
import { createContentModelDocument } from './creators/createContentModelDocument';
import { createFormatContext } from '../formatHandlers/createFormatContext';
import { processElement } from './processors/processElement';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Create Content Model from DOM node
 * @param root Root node of the DOM tree. This node itself will not be included in the Content Model
 * @param range Selection range
 * @param isDarkMode Whether the content is in dark mode
 * @param zoomScale Zoom scale value of the content
 * @param isRtl Whether the content is from right to left
 * @param getDarkColor A callback function used for calculate dark mode color from light mode color
 * @returns A Content Model of the given root and selection
 */
export default function createContentModelFromDOM(
    root: ParentNode,
    range: SelectionRangeEx | null,
    isDarkMode: boolean,
    zoomScale: number,
    isRtl: boolean,
    getDarkColor?: (lightColor: string) => string,
    onlyProcessNode?: HTMLElement
): ContentModelDocument {
    const model = createContentModelDocument(root.ownerDocument!);
    const context = createFormatContext(
        isDarkMode,
        zoomScale,
        isRtl,
        getDarkColor,
        range || undefined
    );

    if (onlyProcessNode) {
        processElement(model, onlyProcessNode, context);
    } else {
        containerProcessor(model, root, context);
    }
    normalizeModel(model);

    return model;
}

function normalizeModel(group: ContentModelBlockGroup) {
    for (let i = group.blocks.length - 1; i >= 0; i--) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case ContentModelBlockType.BlockGroup:
                normalizeModel(block);
                break;
            case ContentModelBlockType.Paragraph:
                for (let j = block.segments.length - 1; j >= 0; j--) {
                    if (isEmptySegment(block.segments[j])) {
                        block.segments.splice(j, 1);
                    }
                }
                break;
            case ContentModelBlockType.Table:
                for (let r = 0; r < block.cells.length; r++) {
                    for (let c = 0; c < block.cells[r].length; c++) {
                        normalizeModel(block.cells[r][c]);
                    }
                }
                break;
        }

        if (isEmptyBlock(block)) {
            group.blocks.splice(i, 1);
        }
    }
}

function isEmptySegment(segment: ContentModelSegment) {
    return (
        segment.segmentType == ContentModelSegmentType.Text &&
        (!segment.text || /^[\r\n]*$/.test(segment.text))
    );
}

function isEmptyBlock(block: ContentModelBlock) {
    return block.blockType == ContentModelBlockType.Paragraph && block.segments.length == 0;
}
