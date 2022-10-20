import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderBoxFormatHandler } from './common/borderBoxFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { ContentModelFormatMap } from '../publicTypes/format/ContentModelFormatMap';
import { directionFormatHandler } from './block/directionFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatHandler } from './FormatHandler';
import { FormatHandlerTypeMap, FormatKey } from '../publicTypes/format/FormatHandlerTypeMap';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { idFormatHandler } from './common/idFormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { marginFormatHandler } from './paragraph/marginFormatHandler';
import { paddingFormatHandler } from './paragraph/paddingFormatHandler';
import { strikeFormatHandler } from './segment/strikeFormatHandler';
import { superOrSubScriptFormatHandler } from './segment/superOrSubScriptFormatHandler';
import { tableCellMetadataFormatHandler } from './table/tableCellMetadataFormatHandler';
import { tableMetadataFormatHandler } from './table/tableMetadataFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';
import { textColorFormatHandler } from './segment/textColorFormatHandler';
import { underlineFormatHandler } from './segment/underlineFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';
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
    direction: directionFormatHandler,
    fontFamily: fontFamilyFormatHandler,
    fontSize: fontSizeFormatHandler,
    id: idFormatHandler,
    italic: italicFormatHandler,
    margin: marginFormatHandler,
    padding: paddingFormatHandler,
    strike: strikeFormatHandler,
    superOrSubScript: superOrSubScriptFormatHandler,
    tableCellMetadata: tableCellMetadataFormatHandler,
    tableMetadata: tableMetadataFormatHandler,
    tableSpacing: tableSpacingFormatHandler,
    textColor: textColorFormatHandler,
    underline: underlineFormatHandler,
    verticalAlign: verticalAlignFormatHandler,
};

const defaultFormatKeysPerCategory: {
    [key in keyof ContentModelFormatMap]: (keyof FormatHandlerTypeMap)[];
} = {
    block: ['backgroundColor', 'direction'],
    listItem: ['listItemThread', 'listItemMetadata'],
    listLevel: ['listType', 'listLevelThread', 'listLevelMetadata'],
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
    ],
    segmentOnBlock: ['fontFamily', 'fontSize', 'underline', 'italic', 'bold', 'textColor'],
    tableCell: [
        'border',
        'borderBox',
        'backgroundColor',
        'padding',
        'direction',
        'verticalAlign',
        'tableCellMetadata',
    ],
    table: [
        'id',
        'border',
        'borderBox',
        'tableMetadata',
        'tableSpacing',
        'margin',
        'backgroundColor',
    ],
};

/**
 * @internal
 */
export function getFormatParsers(
    override: Partial<FormatParsers> = {},
    additionalParsers: Partial<FormatParsersPerCategory> = {}
): FormatParsersPerCategory {
    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(formatKey =>
                override[formatKey] === undefined
                    ? defaultFormatHandlerMap[formatKey].parse
                    : override[formatKey]
            )
            .concat(additionalParsers[key] || []) as FormatParser<any>[];

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
            .map(formatKey =>
                override[formatKey] === undefined
                    ? defaultFormatHandlerMap[formatKey].apply
                    : override[formatKey]
            )
            .concat(additionalAppliers[key] || []) as FormatApplier<any>[];

        result[key] = value;

        return result;
    }, {} as FormatAppliersPerCategory);
}
