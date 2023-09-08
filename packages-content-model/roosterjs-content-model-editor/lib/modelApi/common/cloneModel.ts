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
export type CachedElementHandler = (
    node: HTMLElement,
    type: 'general' | 'entity' | 'cache'
) => HTMLElement | undefined;

/**
 * @internal
 * Options for cloneModel API
 */
export interface CloneModelOptions {
    /**
     * Specify how to deal with cached element, including cached block element, element in General Model, and wrapper element in Entity
     * - True: Cloned model will have the same reference to the cached element
     * - False/Not passed: For cached block element, cached element will be undefined. For General Model and Entity, the element will have deep clone and assign to the cloned model
     * - A callback: invoke the callback with the source cached element and a string to specify model type, let the callback return the expected value of cached element.
     * For General Model and Entity, the callback must return a valid element, otherwise there will be exception thrown.
     */
    includeCachedElement?: boolean | CachedElementHandler;
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
            return cloneEntity(block, options);
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

function cloneEntity(entity: ContentModelEntity, options: CloneModelOptions): ContentModelEntity {
    const { wrapper, isReadonly, type, id } = entity;

    return Object.assign(
        {
            wrapper: handleCachedElement(wrapper, 'entity', options),
            isReadonly,
            type,
            id,
        },
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

function cloneTable(table: ContentModelTable, options: CloneModelOptions): ContentModelTable {
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
    row: ContentModelTableRow,
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
    cell: ContentModelTableCell,
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
    container: ContentModelFormatContainer,
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
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
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
        {
            element: handleCachedElement(element, 'general', options),
        },
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

/**
 * @internal
 */
export function cloneText(textSegment: ContentModelText): ContentModelText {
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
