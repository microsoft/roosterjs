import type { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import type { ContentModelBlockBase } from '../../publicTypes/block/ContentModelBlockBase';
import type { ContentModelBlockGroupBase } from '../../publicTypes/group/ContentModelBlockGroupBase';
import type { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import type { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import type { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import type { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import type { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import type { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import type { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import type { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';
import type { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import type { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import type { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import type { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import type { ContentModelSegmentBase } from '../../publicTypes/segment/ContentModelSegmentBase';
import type { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import type { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import type { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import type { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import type { ContentModelWithDataset } from '../../publicTypes/format/ContentModelWithDataset';
import type { ContentModelWithFormat } from '../../publicTypes/format/ContentModelWithFormat';
import type { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import type { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import type { ContentModelTableRow } from '../../publicTypes/block/ContentModelTableRow';

/**
 * @internal
 */
export function cloneModel(model: ContentModelDocument): ContentModelDocument {
    const newModel: ContentModelDocument = cloneBlockGroupBase(model);

    if (model.format) {
        newModel.format = Object.assign({}, model.format);
    }

    return newModel;
}

function cloneBlock(block: ContentModelBlock): ContentModelBlock {
    switch (block.blockType) {
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'FormatContainer':
                    return cloneFormatContainer(block);
                case 'General':
                    return cloneGeneralBlock(block);
                case 'ListItem':
                    return cloneListItem(block);
            }
            break;
        case 'Divider':
            return cloneDivider(block);
        case 'Entity':
            return cloneEntity(block);
        case 'Paragraph':
            return cloneParagraph(block);
        case 'Table':
            return cloneTable(block);
    }
}

function cloneSegment(segment: ContentModelSegment): ContentModelSegment {
    switch (segment.segmentType) {
        case 'Br':
            return cloneSegmentBase(segment);
        case 'Entity':
            return cloneEntity(segment);
        case 'General':
            return cloneGeneralSegment(segment);
        case 'Image':
            return cloneImage(segment);
        case 'SelectionMarker':
            return cloneSelectionMarker(segment);
        case 'Text':
            return cloneText(segment);
    }
}

function cloneModelWithFormat<T extends ContentModelFormatBase>(
    model: ContentModelWithFormat<T>
): ContentModelWithFormat<T> {
    return {
        format: Object.assign({}, model.format),
    };
}

function cloneModelWithDataset<T>(model: ContentModelWithDataset<T>): ContentModelWithDataset<T> {
    return {
        dataset: Object.assign({}, model.dataset),
    };
}

function cloneBlockBase<T extends ContentModelBlockType>(
    block: ContentModelBlockBase<T>
): ContentModelBlockBase<T> {
    const { blockType } = block;

    return Object.assign(
        {
            blockType,
        },
        cloneModelWithFormat(block)
    );
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
    const { segmentType, isSelected, code, link } = segment;

    const newSegment: ContentModelSegmentBase<T> = Object.assign(
        {
            segmentType,
            isSelected,
        },
        cloneModelWithFormat(segment)
    );

    if (code) {
        newSegment.code = cloneModelWithFormat(code);
    }
    if (link) {
        newSegment.link = Object.assign(cloneModelWithFormat(link), cloneModelWithDataset(link));
    }

    return newSegment;
}

function cloneEntity(entity: ContentModelEntity): ContentModelEntity {
    const { wrapper, isReadonly, type, id } = entity;

    return Object.assign(
        { wrapper, isReadonly, type, id },
        cloneBlockBase(entity),
        cloneSegmentBase(entity)
    );
}

function cloneParagraph(paragraph: ContentModelParagraph): ContentModelParagraph {
    const { cachedElement, segments, isImplicit, decorator, segmentFormat } = paragraph;

    const newParagraph: ContentModelParagraph = Object.assign(
        {
            cachedElement,
            isImplicit,
            segments: segments.map(cloneSegment),
            segmentFormat: segmentFormat ? { ...segmentFormat } : undefined,
        },
        cloneBlockBase(paragraph),
        cloneModelWithFormat(paragraph)
    );

    if (decorator) {
        newParagraph.decorator = Object.assign(
            {
                tagName: decorator.tagName,
            },
            cloneModelWithFormat(decorator)
        );
    }

    return newParagraph;
}

function cloneTable(table: ContentModelTable): ContentModelTable {
    const { cachedElement, widths, rows } = table;

    return Object.assign(
        {
            cachedElement,
            widths: Array.from(widths),
            rows: rows.map(cloneTableRow),
        },
        cloneBlockBase(table),
        cloneModelWithDataset(table)
    );
}

function cloneTableRow(row: ContentModelTableRow): ContentModelTableRow {
    const { height, cells, cachedElement } = row;

    return Object.assign(
        {
            height,
            cachedElement,
            cells: cells.map(cloneTableCell),
        },
        cloneModelWithFormat(row)
    );
}

function cloneTableCell(cell: ContentModelTableCell): ContentModelTableCell {
    const { cachedElement, isSelected, spanAbove, spanLeft, isHeader } = cell;

    return Object.assign(
        { cachedElement, isSelected, spanAbove, spanLeft, isHeader },
        cloneBlockGroupBase(cell),
        cloneModelWithFormat(cell),
        cloneModelWithDataset(cell)
    );
}

function cloneFormatContainer(container: ContentModelFormatContainer): ContentModelFormatContainer {
    const { tagName, cachedElement } = container;
    const newContainer: ContentModelFormatContainer = Object.assign(
        { tagName, cachedElement },
        cloneBlockBase(container),
        cloneBlockGroupBase(container)
    );

    if (container.zeroFontSize) {
        newContainer.zeroFontSize = true;
    }

    return newContainer;
}

function cloneListItem(item: ContentModelListItem): ContentModelListItem {
    const { formatHolder, levels } = item;

    return Object.assign(
        {
            formatHolder: cloneSelectionMarker(formatHolder),
            levels: levels.map(x => Object.assign({}, x)),
        },
        cloneBlockBase(item),
        cloneBlockGroupBase(item)
    );
}

function cloneDivider(divider: ContentModelDivider): ContentModelDivider {
    const { tagName, isSelected, cachedElement } = divider;

    return Object.assign({ isSelected, tagName, cachedElement }, cloneBlockBase(divider));
}

function cloneGeneralBlock(general: ContentModelGeneralBlock): ContentModelGeneralBlock {
    const { element } = general;

    return Object.assign({ element }, cloneBlockBase(general), cloneBlockGroupBase(general));
}

function cloneSelectionMarker(marker: ContentModelSelectionMarker): ContentModelSelectionMarker {
    return Object.assign({ isSelected: marker.isSelected }, cloneSegmentBase(marker));
}

function cloneImage(image: ContentModelImage): ContentModelImage {
    const { src, alt, title, isSelectedAsImageSelection } = image;

    return Object.assign(
        { src, alt, title, isSelectedAsImageSelection },
        cloneSegmentBase(image),
        cloneModelWithDataset(image)
    );
}

function cloneGeneralSegment(general: ContentModelGeneralSegment): ContentModelGeneralSegment {
    return Object.assign(cloneGeneralBlock(general), cloneSegmentBase(general));
}

function cloneText(textSegment: ContentModelText): ContentModelText {
    const { text } = textSegment;
    return Object.assign({ text }, cloneSegmentBase(textSegment));
}
