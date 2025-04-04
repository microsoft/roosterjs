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
    CloneModelOptions,
    ReadonlyContentModelDocument,
    ReadonlyContentModelBlockGroupBase,
    ReadonlyContentModelBlock,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelBlockBase,
    ReadonlyContentModelGeneralBlock,
    ReadonlyContentModelListItem,
    ReadonlyContentModelSelectionMarker,
    ReadonlyContentModelSegmentBase,
    ReadonlyContentModelWithDataset,
    ReadonlyContentModelDivider,
    ReadonlyContentModelListLevel,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
    ReadonlyContentModelTable,
    ReadonlyContentModelTableRow,
    ReadonlyContentModelTableCell,
    ReadonlyContentModelGeneralSegment,
    ReadonlyContentModelImage,
    ReadonlyContentModelText,
} from 'roosterjs-content-model-types';

/**
 * Clone a content model
 * @param model The content model to clone
 * @param options @optional Options to specify customize the clone behavior
 */
export function cloneModel(
    model: ReadonlyContentModelDocument,
    options?: CloneModelOptions
): ContentModelDocument {
    const newModel: ContentModelDocument = cloneBlockGroupBase(model, options || {});

    if (model.format) {
        newModel.format = Object.assign({}, model.format);
    }

    return newModel;
}

function cloneBlock(
    block: ReadonlyContentModelBlock,
    options: CloneModelOptions
): ContentModelBlock {
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
            return cloneEntity(block, options);
        case 'Paragraph':
            return cloneParagraph(block, options);
        case 'Table':
            return cloneTable(block, options);
    }
}

function cloneSegment(
    segment: ReadonlyContentModelSegment,
    options: CloneModelOptions
): ContentModelSegment {
    switch (segment.segmentType) {
        case 'Br':
            return cloneSegmentBase(segment);
        case 'Entity':
            return cloneEntity(segment, options);
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

function cloneModelWithDataset<T>(
    model: ReadonlyContentModelWithDataset<T>
): ContentModelWithDataset<T> {
    return {
        dataset: Object.assign({}, model.dataset),
    };
}

function cloneBlockBase<T extends ContentModelBlockType>(
    block: ReadonlyContentModelBlockBase<T>
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
    group: ReadonlyContentModelBlockGroupBase<T>,
    options: CloneModelOptions
): ContentModelBlockGroupBase<T> {
    const { blockGroupType, blocks } = group;

    return {
        blockGroupType: blockGroupType,
        blocks: blocks.map(block => cloneBlock(block, options)),
    };
}

function cloneSegmentBase<T extends ContentModelSegmentType>(
    segment: ReadonlyContentModelSegmentBase<T>
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

function cloneEntity(entity: ContentModelEntity, options: CloneModelOptions): ContentModelEntity {
    const { wrapper, entityFormat } = entity;

    return Object.assign(
        {
            wrapper: handleCachedElement(wrapper, 'entity', options),
            entityFormat: { ...entityFormat },
        },
        cloneBlockBase(entity),
        cloneSegmentBase(entity)
    );
}

function cloneParagraph(
    paragraph: ReadonlyContentModelParagraph,
    options: CloneModelOptions
): ContentModelParagraph {
    const { cachedElement, segments, isImplicit, decorator, segmentFormat } = paragraph;

    const newParagraph: ContentModelParagraph = Object.assign(
        {
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
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

function cloneTable(
    table: ReadonlyContentModelTable,
    options: CloneModelOptions
): ContentModelTable {
    const { cachedElement, widths, rows } = table;

    return Object.assign(
        {
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
            widths: Array.from(widths),
            rows: rows.map(row => cloneTableRow(row, options)),
        },
        cloneBlockBase(table),
        cloneModelWithDataset(table)
    );
}

function cloneTableRow(
    row: ReadonlyContentModelTableRow,
    options: CloneModelOptions
): ContentModelTableRow {
    const { height, cells, cachedElement } = row;

    return Object.assign(
        {
            height,
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
            cells: cells.map(cell => cloneTableCell(cell, options)),
        },
        cloneModelWithFormat(row)
    );
}

function cloneTableCell(
    cell: ReadonlyContentModelTableCell,
    options: CloneModelOptions
): ContentModelTableCell {
    const { cachedElement, isSelected, spanAbove, spanLeft, isHeader } = cell;

    return Object.assign(
        {
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
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
    container: ReadonlyContentModelFormatContainer,
    options: CloneModelOptions
): ContentModelFormatContainer {
    const { tagName, cachedElement } = container;
    const newContainer: ContentModelFormatContainer = Object.assign(
        { tagName, cachedElement: handleCachedElement(cachedElement, 'cache', options) },
        cloneBlockBase(container),
        cloneBlockGroupBase(container, options)
    );

    if (container.zeroFontSize) {
        newContainer.zeroFontSize = true;
    }

    return newContainer;
}

function cloneListItem(
    item: ReadonlyContentModelListItem,
    options: CloneModelOptions
): ContentModelListItem {
    const { formatHolder, levels, cachedElement } = item;

    return Object.assign(
        {
            formatHolder: cloneSelectionMarker(formatHolder),
            levels: levels.map(cloneListLevel),
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
        },
        cloneBlockBase(item),
        cloneBlockGroupBase(item, options)
    );
}

function cloneListLevel(level: ReadonlyContentModelListLevel): ContentModelListLevel {
    const { listType } = level;

    return Object.assign({ listType }, cloneModelWithFormat(level), cloneModelWithDataset(level));
}
function cloneDivider(
    divider: ReadonlyContentModelDivider,
    options: CloneModelOptions
): ContentModelDivider {
    const { tagName, isSelected, cachedElement } = divider;

    return Object.assign(
        {
            isSelected,
            tagName,
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
        },
        cloneBlockBase(divider)
    );
}

function cloneGeneralBlock(
    general: ReadonlyContentModelGeneralBlock,
    options: CloneModelOptions
): ContentModelGeneralBlock {
    const { element } = general;

    return Object.assign(
        {
            element: handleCachedElement(element, 'general', options),
        },
        cloneBlockBase(general),
        cloneBlockGroupBase(general, options)
    );
}

function cloneSelectionMarker(
    marker: ReadonlyContentModelSelectionMarker
): ContentModelSelectionMarker {
    return Object.assign(
        { isSelected: marker.isSelected, hintText: marker.hintText },
        cloneSegmentBase(marker)
    );
}

function cloneImage(image: ReadonlyContentModelImage): ContentModelImage {
    const { src, alt, title, isSelectedAsImageSelection } = image;

    return Object.assign(
        { src, alt, title, isSelectedAsImageSelection },
        cloneSegmentBase(image),
        cloneModelWithDataset(image)
    );
}

function cloneGeneralSegment(
    general: ReadonlyContentModelGeneralSegment,
    options: CloneModelOptions
): ContentModelGeneralSegment {
    return Object.assign(cloneGeneralBlock(general, options), cloneSegmentBase(general));
}

function cloneText(textSegment: ReadonlyContentModelText): ContentModelText {
    const { text } = textSegment;
    return Object.assign({ text }, cloneSegmentBase(textSegment));
}

function handleCachedElement<T extends HTMLElement>(
    node: T,
    type: 'general' | 'entity',
    options: CloneModelOptions
): T;

function handleCachedElement<T extends HTMLElement>(
    node: T | undefined,
    type: 'cache',
    options: CloneModelOptions
): T | undefined;

function handleCachedElement<T extends HTMLElement>(
    node: T | undefined,
    type: 'general' | 'entity' | 'cache',
    options: CloneModelOptions
): T | undefined {
    const { includeCachedElement } = options;

    if (!node) {
        return undefined;
    } else if (!includeCachedElement) {
        return type == 'cache' ? undefined : (node.cloneNode(true /*deep*/) as T);
    } else if (includeCachedElement === true) {
        return node;
    } else {
        const result = includeCachedElement(node, type) as T | undefined;

        if ((type == 'general' || type == 'entity') && !result) {
            throw new Error('Entity and General Model must has wrapper element');
        }

        return result;
    }
}
