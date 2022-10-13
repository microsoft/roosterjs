import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderBoxFormatHandler } from './common/borderBoxFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { directionFormatHandler } from './block/directionFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatHandler } from './FormatHandler';
import { FormatHandlerTypeMap, FormatKey } from '../publicTypes/format/FormatHandlerTypeMap';
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

const emptyHandler: FormatHandler<{}> = {
    parse: () => {},
    apply: () => {},
};

/**
 * @internal
 */
export type FormatHandlers = {
    [Key in FormatKey]: FormatHandler<FormatHandlerTypeMap[Key]>;
};

/**
 * @internal
 */
export const defaultFormatHandlerMap: FormatHandlers = {
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

    blockCustomize: emptyHandler,
    listItemCustomize: emptyHandler,
    listLevelCustomize: emptyHandler,
    segmentCustomize: emptyHandler,
    tableCellCustomize: emptyHandler,
    tableCustomize: emptyHandler,
};
