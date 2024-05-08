import { createFormatObject } from '../creators/createFormatObject';
import { internalConvertToMutableType } from '../creators/internalConvertToMutableType';
import type {
    ContentModelBlock,
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
    ContentModelSegmentType,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableCell,
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
    ReadonlyContentModelWithFormat,
    ReadonlyContentModelTableRow,
    ReadonlyContentModelTableCell,
    ReadonlyContentModelGeneralBlock,
    ReadonlyContentModelWithDataset,
    ReadonlyContentModelDivider,
    ReadonlyContentModelSegment,
    ReadonlyContentModelSegmentBase,
    ReadonlyContentModelEntity,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelTable,
    ReadonlyContentModelListItem,
    ReadonlyContentModelSelectionMarker,
    ReadonlyContentModelImage,
    ReadonlyContentModelGeneralSegment,
    ReadonlyContentModelText,
    ContentModelSegmentFormat,
    ReadonlyContentModelListLevel,
    ReadonlyContentModelBr,
    ContentModelBr,
} from 'roosterjs-content-model-types';

//#region Main function

/**
 * Clone a content model
 * @param model The content model to clone
 * @param options @optional Options to specify customize the clone behavior
 */
export function cloneModel(
    model: ReadonlyContentModelDocument,
    options?: CloneModelOptions
): ContentModelDocument {
    const newModel: ReadonlyContentModelDocument = cloneBlockGroupBase(model, options || {});
    const result = internalConvertToMutableType(newModel);

    if (model.format) {
        result.format = createFormatObject<ContentModelSegmentFormat>(model.format);
    }

    return result;
}

//#endregion

//#region dispatchers

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
            return cloneBr(segment);
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

//#endregion

//#region base cloner

function cloneModelWithFormat<T extends ContentModelFormatBase>(
    model: ReadonlyContentModelWithFormat<T>
): ReadonlyContentModelWithFormat<T> {
    return {
        format: Object.assign({}, model.format),
    };
}

function cloneModelWithDataset<T>(
    model: ReadonlyContentModelWithDataset<T>
): ReadonlyContentModelWithDataset<T> {
    return {
        dataset: Object.assign({}, model.dataset),
    };
}

function cloneBlockBase<T extends ContentModelBlockType>(
    block: ReadonlyContentModelBlockBase<T>
): ReadonlyContentModelBlockBase<T> {
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
): ReadonlyContentModelBlockGroupBase<T> {
    const { blockGroupType, blocks } = group;

    return {
        blockGroupType: blockGroupType,
        blocks: blocks.map(block => cloneBlock(block, options)),
    };
}

function cloneSegmentBase<T extends ContentModelSegmentType>(
    segment: ReadonlyContentModelSegmentBase<T>
): ReadonlyContentModelSegmentBase<T> {
    const { segmentType, isSelected, code, link } = segment;

    const newSegment: ReadonlyContentModelSegmentBase<T> = Object.assign(
        {
            segmentType,
            isSelected,
        },
        cloneModelWithFormat(segment),
        code ? { code: cloneModelWithFormat(code) } : undefined,
        link
            ? { link: Object.assign(cloneModelWithFormat(link), cloneModelWithDataset(link)) }
            : undefined
    );

    return newSegment;
}

//#endregion

//#region model cloner

function cloneEntity(
    entity: ReadonlyContentModelEntity,
    options: CloneModelOptions
): ContentModelEntity {
    const { wrapper, entityFormat } = entity;
    const result: ReadonlyContentModelEntity = Object.assign(
        {
            wrapper: handleCachedElement(wrapper, 'entity', options),
            entityFormat: { ...entityFormat },
        },
        cloneBlockBase(entity),
        cloneSegmentBase(entity)
    );

    return internalConvertToMutableType(result);
}

function cloneParagraph(
    paragraph: ReadonlyContentModelParagraph,
    options: CloneModelOptions
): ContentModelParagraph {
    const { cachedElement, segments, isImplicit, decorator, segmentFormat } = paragraph;
    const newParagraph: ReadonlyContentModelParagraph = Object.assign(
        {
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
            isImplicit,
            segments: segments.map(segment => cloneSegment(segment, options)),
            segmentFormat: segmentFormat ? { ...segmentFormat } : undefined,
        },
        cloneBlockBase(paragraph),
        cloneModelWithFormat(paragraph),
        decorator
            ? {
                  decorator: Object.assign(
                      {
                          tagName: decorator.tagName,
                      },
                      cloneModelWithFormat(decorator)
                  ),
              }
            : undefined
    );

    return internalConvertToMutableType(newParagraph);
}

function cloneTable(
    table: ReadonlyContentModelTable,
    options: CloneModelOptions
): ContentModelTable {
    const { cachedElement, widths, rows } = table;
    const result: ReadonlyContentModelTable = Object.assign(
        {
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
            widths: Array.from(widths),
            rows: rows.map(row => cloneTableRow(row, options)),
        },
        cloneBlockBase(table),
        cloneModelWithDataset(table)
    );

    return internalConvertToMutableType(result);
}

function cloneTableRow(
    row: ReadonlyContentModelTableRow,
    options: CloneModelOptions
): ContentModelTableRow {
    const { height, cells, cachedElement } = row;
    const result: ReadonlyContentModelTableRow = Object.assign(
        {
            height,
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
            cells: cells.map(cell => cloneTableCell(cell, options)),
        },
        cloneModelWithFormat(row)
    );

    return internalConvertToMutableType(result);
}

function cloneTableCell(
    cell: ReadonlyContentModelTableCell,
    options: CloneModelOptions
): ContentModelTableCell {
    const { cachedElement, isSelected, spanAbove, spanLeft, isHeader } = cell;
    const result: ReadonlyContentModelTableCell = Object.assign(
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

    return internalConvertToMutableType(result);
}

function cloneFormatContainer(
    container: ReadonlyContentModelFormatContainer,
    options: CloneModelOptions
): ContentModelFormatContainer {
    const { tagName, cachedElement, zeroFontSize } = container;
    const newContainer: ReadonlyContentModelFormatContainer = Object.assign(
        { tagName, cachedElement: handleCachedElement(cachedElement, 'cache', options) },
        cloneBlockBase(container),
        cloneBlockGroupBase(container, options),
        zeroFontSize ? { zeroFontSize: true } : undefined
    );

    return internalConvertToMutableType(newContainer);
}

function cloneListItem(
    item: ReadonlyContentModelListItem,
    options: CloneModelOptions
): ContentModelListItem {
    const { formatHolder, levels } = item;
    const result: ReadonlyContentModelListItem = Object.assign(
        {
            formatHolder: cloneSelectionMarker(formatHolder),
            levels: levels.map(cloneListLevel),
        },
        cloneBlockBase(item),
        cloneBlockGroupBase(item, options)
    );

    return internalConvertToMutableType(result);
}

function cloneListLevel(level: ReadonlyContentModelListLevel): ContentModelListLevel {
    const { listType } = level;
    const result: ReadonlyContentModelListLevel = Object.assign(
        { listType },
        cloneModelWithFormat(level),
        cloneModelWithDataset(level)
    );

    return internalConvertToMutableType(result);
}

function cloneDivider(
    divider: ReadonlyContentModelDivider,
    options: CloneModelOptions
): ContentModelDivider {
    const { tagName, isSelected, cachedElement } = divider;
    const result: ReadonlyContentModelDivider = Object.assign(
        {
            isSelected,
            tagName,
            cachedElement: handleCachedElement(cachedElement, 'cache', options),
        },
        cloneBlockBase(divider)
    );

    return internalConvertToMutableType(result);
}

function cloneGeneralBlock(
    general: ReadonlyContentModelGeneralBlock,
    options: CloneModelOptions
): ContentModelGeneralBlock {
    const { element } = general;

    const result: ReadonlyContentModelGeneralBlock = Object.assign(
        {
            element: handleCachedElement(element, 'general', options),
        },
        cloneBlockBase(general),
        cloneBlockGroupBase(general, options)
    );

    return internalConvertToMutableType(result);
}

function cloneSelectionMarker(
    marker: ReadonlyContentModelSelectionMarker
): ContentModelSelectionMarker {
    const result: ReadonlyContentModelSelectionMarker = Object.assign(
        { isSelected: marker.isSelected },
        cloneSegmentBase(marker)
    );

    return internalConvertToMutableType(result);
}

function cloneImage(image: ReadonlyContentModelImage): ContentModelImage {
    const { src, alt, title, isSelectedAsImageSelection } = image;

    const result: ReadonlyContentModelImage = Object.assign(
        { src, alt, title, isSelectedAsImageSelection },
        cloneSegmentBase(image),
        cloneModelWithDataset(image)
    );

    return internalConvertToMutableType(result);
}

function cloneGeneralSegment(
    general: ReadonlyContentModelGeneralSegment,
    options: CloneModelOptions
): ContentModelGeneralSegment {
    const result: ReadonlyContentModelGeneralSegment = Object.assign(
        cloneGeneralBlock(general, options),
        cloneSegmentBase(general)
    );
    return internalConvertToMutableType(result);
}

function cloneText(textSegment: ReadonlyContentModelText): ContentModelText {
    const { text } = textSegment;
    const result: ReadonlyContentModelText = Object.assign({ text }, cloneSegmentBase(textSegment));

    return internalConvertToMutableType(result);
}

function cloneBr(br: ReadonlyContentModelBr): ContentModelBr {
    const result: ReadonlyContentModelBr = cloneSegmentBase(br);

    return internalConvertToMutableType(result);
}

//#endregion

//#region utilities

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

//#endregion
