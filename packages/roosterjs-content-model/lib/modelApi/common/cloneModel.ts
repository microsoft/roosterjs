import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockBase } from '../../publicTypes/block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from '../../publicTypes/group/ContentModelBlockGroupBase';
import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentBase } from '../../publicTypes/segment/ContentModelSegmentBase';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';

/**
 * @internal
 */
export function cloneModel(model: ContentModelDocument): ContentModelDocument {
    return {
        ...cloneBlockGroupBase(model),
        format: model.format,
    };
}

function cloneFormat<T extends ContentModelFormatBase>(format: T): T {
    return { ...format };
}

function cloneBlockBase<T extends ContentModelBlockType>(
    block: ContentModelBlockBase<T>
): ContentModelBlockBase<T> {
    const { blockType, format } = block;

    return {
        blockType: blockType,
        format: cloneFormat(format),
    };
}

function cloneBlockGroupBase<T extends ContentModelBlockGroupType>(
    group: ContentModelBlockGroupBase<T>
): ContentModelBlockGroupBase<T> {
    const { blockGroupType, blocks } = group;

    return {
        blockGroupType: blockGroupType,
        blocks: blocks.map(cloneBlock),
    };
}

function cloneSegmentBase<T extends ContentModelSegmentType>(
    segment: ContentModelSegmentBase<T>
): ContentModelSegmentBase<T> {
    const { segmentType, format, isSelected, code, link } = segment;

    return {
        segmentType: segmentType,
        format: cloneFormat(format),
        isSelected: isSelected,
        code: code ? { format: cloneFormat(code.format) } : undefined,
        link: link
            ? {
                  format: cloneFormat(link.format),
                  dataset: cloneFormat(link.dataset),
              }
            : undefined,
    };
}

function cloneEntity(entity: ContentModelEntity): ContentModelEntity {
    const { wrapper, isReadonly, type, id } = entity;

    return {
        ...cloneBlockBase(entity),
        ...cloneSegmentBase(entity),
        wrapper: wrapper,
        isReadonly: isReadonly,
        type: type,
        id: id,
    };
}

function cloneParagraph(paragraph: ContentModelParagraph): ContentModelParagraph {
    const { cachedElement, segments, isImplicit, decorator } = paragraph;
    return {
        ...cloneBlockBase(paragraph),
        cachedElement,
        segments: segments.map(cloneSegment),
        isImplicit: isImplicit,
        decorator: decorator
            ? {
                  tagName: decorator.tagName,
                  format: cloneFormat(decorator.format),
              }
            : undefined,
    };
}

function cloneTable(table: ContentModelTable): ContentModelTable {
    const { dataset, cachedElement, widths, heights, cells } = table;

    return {
        ...cloneBlockBase(table),
        dataset: cloneFormat(dataset),
        cachedElement,
        widths: [...widths],
        heights: [...heights],
        cells: cells.map(row => row.map(cloneTableCell)),
    };
}

function cloneTableCell(cell: ContentModelTableCell): ContentModelTableCell {
    const { format, dataset, cachedElement, isSelected, spanAbove, spanLeft, isHeader } = cell;

    return {
        ...cloneBlockGroupBase(cell),
        format: cloneFormat(format),
        dataset: cloneFormat(dataset),
        cachedElement,
        isSelected,
        spanAbove,
        spanLeft,
        isHeader,
    };
}

function cloneGeneralBlock(block: ContentModelGeneralBlock): ContentModelGeneralBlock {
    return {
        ...cloneBlockBase(block),
        ...cloneBlockGroupBase(block),
        element: block.element,
    };
}

function cloneSelectionMarker(marker: ContentModelSelectionMarker): ContentModelSelectionMarker {
    return {
        ...cloneSegmentBase(marker),
        isSelected: true,
    };
}

function cloneBlock(block: ContentModelBlock): ContentModelBlock {
    switch (block.blockType) {
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'FormatContainer':
                    return {
                        ...cloneBlockBase(block),
                        ...cloneBlockGroupBase(block),
                        tagName: block.tagName,
                        cachedElement: block.cachedElement,
                    };
                case 'General':
                    return cloneGeneralBlock(block);
                case 'ListItem':
                    return {
                        ...cloneBlockBase(block),
                        ...cloneBlockGroupBase(block),
                        formatHolder: cloneSelectionMarker(block.formatHolder),
                        levels: block.levels.map(cloneFormat),
                    };
            }
            break;

        case 'Divider':
            return {
                ...cloneBlockBase(block),
                isSelected: block.isSelected,
                tagName: block.tagName,
                cachedElement: block.cachedElement,
            };
        case 'Entity':
            return cloneEntity(block);
        case 'Paragraph':
            return cloneParagraph(block);
        case 'Table':
            return cloneTable(block);
    }
}

function cloneImage(image: ContentModelImage): ContentModelImage {
    const { dataset, src, alt, title, isSelectedAsImageSelection } = image;

    return {
        ...cloneSegmentBase(image),
        dataset,
        src,
        alt,
        title,
        isSelectedAsImageSelection,
    };
}

function cloneSegment(segment: ContentModelSegment): ContentModelSegment {
    switch (segment.segmentType) {
        case 'Br':
            return {
                ...cloneSegmentBase(segment),
            };
        case 'Entity':
            return cloneEntity(segment);
        case 'General':
            return {
                ...cloneGeneralBlock(segment),
                ...cloneSegmentBase(segment),
            };
        case 'Image':
            return cloneImage(segment);
        case 'SelectionMarker':
            return cloneSelectionMarker(segment);
        case 'Text':
            return {
                ...cloneSegmentBase(segment),
                text: segment.text,
            };
    }
}
