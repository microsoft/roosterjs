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
    ContentModelListLevel,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface CloneModelOptions {
    skipCachedElement?: boolean;
}

/**
 * @internal
 */
export function cloneModel(
    model: ContentModelDocument,
    options?: CloneModelOptions
): ContentModelDocument {
    const newModel: ContentModelDocument = cloneBlockGroupBase(model, options || {});

    if (model.format) {
        newModel.format = Object.assign({}, model.format);
    }

    return newModel;
}

function cloneBlock(block: ContentModelBlock, options: CloneModelOptions): ContentModelBlock {
    switch (block.blockType) {
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'FormatContainer':
                    return cloneFormatContainer(block, options);
                case 'General':
                    return cloneGeneralBlock(block, options);
                case 'ListItem':
                    return cloneListItem(block, options);
            }
            break;
        case 'Divider':
            return cloneDivider(block, options);
        case 'Entity':
            return cloneEntity(block);
        case 'Paragraph':
            return cloneParagraph(block, options);
        case 'Table':
            return cloneTable(block, options);
    }
}

function cloneSegment(
    segment: ContentModelSegment,
    options: CloneModelOptions
): ContentModelSegment {
    switch (segment.segmentType) {
        case 'Br':
            return cloneSegmentBase(segment);
        case 'Entity':
            return cloneEntity(segment);
        case 'General':
            return cloneGeneralSegment(segment, options);
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
    group: ContentModelBlockGroupBase<T>,
    options: CloneModelOptions
): ContentModelBlockGroupBase<T> {
    const { blockGroupType, blocks } = group;

    return {
        blockGroupType: blockGroupType,
        blocks: blocks.map(block => cloneBlock(block, options)),
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

function cloneParagraph(
    paragraph: ContentModelParagraph,
    options: CloneModelOptions
): ContentModelParagraph {
    const { cachedElement, segments, isImplicit, decorator, segmentFormat } = paragraph;

    const newParagraph: ContentModelParagraph = Object.assign(
        {
            cachedElement: options.skipCachedElement ? undefined : cachedElement,
            isImplicit,
            segments: segments.map(segment => cloneSegment(segment, options)),
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

function cloneTable(table: ContentModelTable, options: CloneModelOptions): ContentModelTable {
    const { cachedElement, widths, rows } = table;

    return Object.assign(
        {
            cachedElement: options.skipCachedElement ? undefined : cachedElement,
            widths: Array.from(widths),
            rows: rows.map(row => cloneTableRow(row, options)),
        },
        cloneBlockBase(table),
        cloneModelWithDataset(table)
    );
}

function cloneTableRow(
    row: ContentModelTableRow,
    options: CloneModelOptions
): ContentModelTableRow {
    const { height, cells, cachedElement } = row;

    return Object.assign(
        {
            height,
            cachedElement: options.skipCachedElement ? undefined : cachedElement,
            cells: cells.map(c => cloneTableCell(c, options)),
        },
        cloneModelWithFormat(row)
    );
}

function cloneTableCell(
    cell: ContentModelTableCell,
    options: CloneModelOptions
): ContentModelTableCell {
    const { cachedElement, isSelected, spanAbove, spanLeft, isHeader } = cell;

    return Object.assign(
        {
            cachedElement: options.skipCachedElement ? undefined : cachedElement,
            isSelected,
            spanAbove,
            spanLeft,
            isHeader,
        },
        cloneBlockGroupBase(cell, options),
        cloneModelWithFormat(cell),
        cloneModelWithDataset(cell)
    );
}

function cloneFormatContainer(
    container: ContentModelFormatContainer,
    options: CloneModelOptions
): ContentModelFormatContainer {
    const { tagName, cachedElement } = container;
    const newContainer: ContentModelFormatContainer = Object.assign(
        {
            tagName,
            cachedElement: options.skipCachedElement ? undefined : cachedElement,
        },
        cloneBlockBase(container),
        cloneBlockGroupBase(container, options)
    );

    if (container.zeroFontSize) {
        newContainer.zeroFontSize = true;
    }

    return newContainer;
}

function cloneListItem(
    item: ContentModelListItem,
    options: CloneModelOptions
): ContentModelListItem {
    const { formatHolder, levels } = item;

    return Object.assign(
        {
            formatHolder: cloneSelectionMarker(formatHolder),
            levels: levels.map(cloneListLevel),
        },
        cloneBlockBase(item),
        cloneBlockGroupBase(item, options)
    );
}

function cloneListLevel(level: ContentModelListLevel): ContentModelListLevel {
    const { listType } = level;

    return Object.assign({ listType }, cloneModelWithFormat(level), cloneModelWithDataset(level));
}
function cloneDivider(
    divider: ContentModelDivider,
    options: CloneModelOptions
): ContentModelDivider {
    const { tagName, isSelected, cachedElement } = divider;

    return Object.assign(
        {
            isSelected,
            tagName,
            cachedElement: options.skipCachedElement ? undefined : cachedElement,
        },
        cloneBlockBase(divider)
    );
}

function cloneGeneralBlock(
    general: ContentModelGeneralBlock,
    options: CloneModelOptions
): ContentModelGeneralBlock {
    const { element } = general;

    return Object.assign(
        { element },
        cloneBlockBase(general),
        cloneBlockGroupBase(general, options)
    );
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

function cloneGeneralSegment(
    general: ContentModelGeneralSegment,
    options: CloneModelOptions
): ContentModelGeneralSegment {
    return Object.assign(cloneGeneralBlock(general, options), cloneSegmentBase(general));
}

function cloneText(textSegment: ContentModelText): ContentModelText {
    const { text } = textSegment;
    return Object.assign({ text }, cloneSegmentBase(textSegment));
}
