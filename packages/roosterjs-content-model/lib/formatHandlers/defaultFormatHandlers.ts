import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderBoxFormatHandler } from './common/borderBoxFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { directionFormatHandler } from './block/directionFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatAppliers } from '../publicTypes/context/ModelToDomSettings';
import { FormatHandler } from './FormatHandler';
import { FormatHandlerTypeMap, FormatKey } from '../publicTypes/format/FormatHandlerTypeMap';
import { FormatParsers } from '../publicTypes/context/DomToModelSettings';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { idFormatHandler } from './common/idFormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { listItemMetadataFormatHandler } from './list/listItemMetadataFormatHandler';
import { listItemThreadFormatHandler } from './list/listItemThreadFormatHandler';
import { listLevelMetadataFormatHandler } from './list/listLevelMetadataFormatHandler';
import { listLevelThreadFormatHandler } from './list/listLevelThreadFormatHandler';
import { listTypeFormatHandler } from './list/listTypeFormatHandler';
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
    listItemMetadata: listItemMetadataFormatHandler,
    listItemThread: listItemThreadFormatHandler,
    listLevelMetadata: listLevelMetadataFormatHandler,
    listLevelThread: listLevelThreadFormatHandler,
    listType: listTypeFormatHandler,
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

/**
 * @internal
 */
export function getFormatParsers(option?: Partial<FormatParsers>): FormatParsers {
    return getObjectKeys(defaultFormatHandlerMap).reduce((parsers, key) => {
        const parser = option?.[key];
        parsers[key] = typeof parser === 'undefined' ? defaultFormatHandlerMap[key].parse : parser;

        return parsers;
    }, <FormatParsers>{});
}

/**
 * @internal
 */
export function getFormatAppliers(option?: Partial<FormatAppliers>): FormatAppliers {
    return getObjectKeys(defaultFormatHandlerMap).reduce((appliers, key) => {
        const applier = option?.[key];
        appliers[key] =
            typeof applier === 'undefined' ? defaultFormatHandlerMap[key].apply : applier;

        return appliers;
    }, <FormatAppliers>{});
}
