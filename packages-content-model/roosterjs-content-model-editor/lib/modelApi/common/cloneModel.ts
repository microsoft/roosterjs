import type {
    ContentModelBlock,
    ContentModelBlockBase,
    ContentModelBlockGroupBase,
    ContentModelBlockGroupType,
    ContentModelBlockType,
    ContentModelDivider,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelFormatBase,
    ContentModelFormatContainer,
    ContentModelGeneralBlock,
    ContentModelImage,
    ContentModelListItem,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentBase,
    ContentModelSegmentType,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableCell,
    ContentModelWithDataset,
    ContentModelWithFormat,
    ContentModelGeneralSegment,
    ContentModelText,
    ContentModelTableRow,
} from 'roosterjs-content-model-types';

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
