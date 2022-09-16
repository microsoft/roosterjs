import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatAppliers } from '../publicTypes/context/ModelToDomSettings';
import { FormatHandler } from './FormatHandler';
import { FormatHandlerTypeMap, FormatKey } from '../publicTypes/format/FormatHandlerTypeMap';
import { FormatParsers } from '../publicTypes/context/DomToModelSettings';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { idFormatHandler } from './common/idFormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { marginFormatHandler } from './paragraph/marginFormatHandler';
import { strikeFormatHandler } from './segment/strikeFormatHandler';
import { superOrSubScriptFormatHandler } from './segment/superOrSubScriptFormatHandler';
import { tableCellMetadataFormatHandler } from './table/tableCellMetadataFormatHandler';
import { tableMetadataFormatHandler } from './table/tableMetadataFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';
import { textAlignFormatHandler } from './common/textAlignFormatHandler';
import { textColorFormatHandler } from './segment/textColorFormatHandler';
import { underlineFormatHandler } from './segment/underlineFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';

type FormatHandlers = {
    [Key in FormatKey]: FormatHandler<FormatHandlerTypeMap[Key]>;
};

const defaultFormatHandlerMap: FormatHandlers = {
    backgroundColor: backgroundColorFormatHandler,
    bold: boldFormatHandler,
    border: borderFormatHandler,
    fontFamily: fontFamilyFormatHandler,
    fontSize: fontSizeFormatHandler,
    id: idFormatHandler,
    italic: italicFormatHandler,
    margin: marginFormatHandler,
    strike: strikeFormatHandler,
    superOrSubScript: superOrSubScriptFormatHandler,
    tableCellMetadata: tableCellMetadataFormatHandler,
    tableMetadata: tableMetadataFormatHandler,
    tableSpacing: tableSpacingFormatHandler,
    textAlign: textAlignFormatHandler,
    textColor: textColorFormatHandler,
    underline: underlineFormatHandler,
    verticalAlign: verticalAlignFormatHandler,
};

/**
 * @internal
 */
export function getFormatParsers(option?: Partial<FormatParsers>): FormatParsers {
    return getObjectKeys(defaultFormatHandlerMap).reduce((parsers, key) => {
        parsers[key] = option?.[key] || defaultFormatHandlerMap[key].parse;

        return parsers;
    }, <FormatParsers>{});
}

/**
 * @internal
 */
export function getFormatAppliers(option?: Partial<FormatAppliers>): FormatAppliers {
    return getObjectKeys(defaultFormatHandlerMap).reduce((parsers, key) => {
        parsers[key] = option?.[key] || defaultFormatHandlerMap[key].apply;

        return parsers;
    }, <FormatAppliers>{});
}
