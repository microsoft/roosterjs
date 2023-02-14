import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderBoxFormatHandler } from './common/borderBoxFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { boxShadowFormatHandler } from './common/boxShadowFormatHandler';
import { ContentModelFormatMap } from '../publicTypes/format/ContentModelFormatMap';
import { datasetFormatHandler } from './common/datasetFormatHandler';
import { directionFormatHandler } from './block/directionFormatHandler';
import { displayFormatHandler } from './block/displayFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatHandler } from './FormatHandler';
import { FormatHandlerTypeMap, FormatKey } from '../publicTypes/format/FormatHandlerTypeMap';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { idFormatHandler } from './common/idFormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { lineHeightFormatHandler } from './block/lineHeightFormatHandler';
import { linkFormatHandler } from './segment/linkFormatHandler';
import { listItemMetadataFormatHandler } from './list/listItemMetadataFormatHandler';
import { listItemThreadFormatHandler } from './list/listItemThreadFormatHandler';
import { listLevelMetadataFormatHandler } from './list/listLevelMetadataFormatHandler';
import { listLevelThreadFormatHandler } from './list/listLevelThreadFormatHandler';
import { listTypeFormatHandler } from './list/listTypeFormatHandler';
import { marginFormatHandler } from './paragraph/marginFormatHandler';
import { paddingFormatHandler } from './paragraph/paddingFormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';
import { strikeFormatHandler } from './segment/strikeFormatHandler';
import { superOrSubScriptFormatHandler } from './segment/superOrSubScriptFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';
import { textColorFormatHandler } from './segment/textColorFormatHandler';
import { underlineFormatHandler } from './segment/underlineFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';
import { whiteSpaceFormatHandler } from './block/whiteSpaceFormatHandler';
import { wordBreakFormatHandler } from './common/wordBreakFormatHandler';
import {
    FormatApplier,
    FormatAppliers,
    FormatAppliersPerCategory,
} from '../publicTypes/context/ModelToDomSettings';
import {
    FormatParser,
    FormatParsers,
    FormatParsersPerCategory,
} from '../publicTypes/context/DomToModelSettings';

type FormatHandlers = {
    [Key in FormatKey]: FormatHandler<FormatHandlerTypeMap[Key]>;
};

const defaultFormatHandlerMap: FormatHandlers = {
    backgroundColor: backgroundColorFormatHandler,
    bold: boldFormatHandler,
    border: borderFormatHandler,
    borderBox: borderBoxFormatHandler,
    boxShadow: boxShadowFormatHandler,
    dataset: datasetFormatHandler,
    direction: directionFormatHandler,
    display: displayFormatHandler,
    fontFamily: fontFamilyFormatHandler,
    fontSize: fontSizeFormatHandler,
    id: idFormatHandler,
    italic: italicFormatHandler,
    lineHeight: lineHeightFormatHandler,
    link: linkFormatHandler,
    listItemMetadata: listItemMetadataFormatHandler,
    listItemThread: listItemThreadFormatHandler,
    listLevelMetadata: listLevelMetadataFormatHandler,
    listLevelThread: listLevelThreadFormatHandler,
    listType: listTypeFormatHandler,
    margin: marginFormatHandler,
    padding: paddingFormatHandler,
    size: sizeFormatHandler,
    strike: strikeFormatHandler,
    superOrSubScript: superOrSubScriptFormatHandler,
    tableSpacing: tableSpacingFormatHandler,
    textColor: textColorFormatHandler,
    underline: underlineFormatHandler,
    verticalAlign: verticalAlignFormatHandler,
    whiteSpace: whiteSpaceFormatHandler,
    wordBreak: wordBreakFormatHandler,
};

const blockFormatHandlers: (keyof FormatHandlerTypeMap)[] = [
    'backgroundColor',
    'direction',
    'margin',
    'padding',
    'lineHeight',
    'whiteSpace',
    'border',
    'display',
];

const defaultFormatKeysPerCategory: {
    [key in keyof ContentModelFormatMap]: (keyof FormatHandlerTypeMap)[];
} = {
    block: blockFormatHandlers,
    listItem: ['listItemThread', 'listItemMetadata'],
    listLevel: ['listType', 'listLevelThread', 'listLevelMetadata', 'direction', 'display'],
    segment: [
        'superOrSubScript',
        'strike',
        'fontFamily',
        'fontSize',
        'underline',
        'italic',
        'bold',
        'textColor',
        'backgroundColor',
        'lineHeight',
        'direction',
    ],
    segmentOnBlock: ['fontFamily', 'fontSize', 'underline', 'italic', 'bold', 'textColor'],
    segmentOnTableCell: ['fontFamily', 'fontSize', 'underline', 'italic', 'bold'],
    tableCell: [
        'border',
        'borderBox',
        'backgroundColor',
        'padding',
        'direction',
        'verticalAlign',
        'wordBreak',
        'textColor',
    ],
    table: [
        'id',
        'border',
        'borderBox',
        'tableSpacing',
        'margin',
        'backgroundColor',
        'display',
        'direction',
    ],
    image: ['id', 'size', 'margin', 'padding', 'borderBox', 'border', 'boxShadow'],
    link: ['link', 'textColor', 'underline'],
    dataset: ['dataset'],
    divider: [...blockFormatHandlers, 'display', 'size'],
};

/**
 * @internal
 */
export const defaultFormatParsers: FormatParsers = getObjectKeys(defaultFormatHandlerMap).reduce(
    (result, key) => {
        result[key] = defaultFormatHandlerMap[key].parse as FormatParser<any>;
        return result;
    },
    <FormatParsers>{}
);

/**
 * @internal
 */
export const defaultFormatAppliers: FormatAppliers = getObjectKeys(defaultFormatHandlerMap).reduce(
    (result, key) => {
        result[key] = defaultFormatHandlerMap[key].apply as FormatApplier<any>;
        return result;
    },
    <FormatAppliers>{}
);

/**
 * @internal
 */
export function getFormatParsers(
    override: Partial<FormatParsers> = {},
    additionalParsers: Partial<FormatParsersPerCategory> = {}
): FormatParsersPerCategory {
    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(
                formatKey =>
                    (override[formatKey] === undefined
                        ? defaultFormatParsers[formatKey]
                        : override[formatKey]) as FormatParser<any>
            )
            .concat((additionalParsers[key] as FormatParser<any>[]) || []);

        result[key] = value;

        return result;
    }, {} as FormatParsersPerCategory);
}

/**
 * @internal
 */
export function getFormatAppliers(
    override: Partial<FormatAppliers> = {},
    additionalAppliers: Partial<FormatAppliersPerCategory> = {}
): FormatAppliersPerCategory {
    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(
                formatKey =>
                    (override[formatKey] === undefined
                        ? defaultFormatAppliers[formatKey]
                        : override[formatKey]) as FormatApplier<any>
            )
            .concat((additionalAppliers[key] as FormatApplier<any>[]) || []);

        result[key] = value;

        return result;
    }, {} as FormatAppliersPerCategory);
}
