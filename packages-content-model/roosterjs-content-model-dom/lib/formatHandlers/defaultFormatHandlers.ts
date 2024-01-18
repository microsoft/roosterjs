import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderBoxFormatHandler } from './common/borderBoxFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { boxShadowFormatHandler } from './common/boxShadowFormatHandler';
import { datasetFormatHandler } from './common/datasetFormatHandler';
import { directionFormatHandler } from './block/directionFormatHandler';
import { displayFormatHandler } from './block/displayFormatHandler';
import { entityFormatHandler } from './entity/entityFormatHandler';
import { floatFormatHandler } from './common/floatFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { getObjectKeys } from '../domUtils/getObjectKeys';
import { htmlAlignFormatHandler } from './block/htmlAlignFormatHandler';
import { idFormatHandler } from './common/idFormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { letterSpacingFormatHandler } from './segment/letterSpacingFormatHandler';
import { lineHeightFormatHandler } from './block/lineHeightFormatHandler';
import { linkFormatHandler } from './segment/linkFormatHandler';
import { listItemThreadFormatHandler } from './list/listItemThreadFormatHandler';
import { listLevelThreadFormatHandler } from './list/listLevelThreadFormatHandler';
import { listStyleFormatHandler } from './list/listStyleFormatHandler';
import { marginFormatHandler } from './block/marginFormatHandler';
import { paddingFormatHandler } from './block/paddingFormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';
import { strikeFormatHandler } from './segment/strikeFormatHandler';
import { superOrSubScriptFormatHandler } from './segment/superOrSubScriptFormatHandler';
import { tableLayoutFormatHandler } from './table/tableLayoutFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';
import { textAlignFormatHandler } from './block/textAlignFormatHandler';
import { textColorFormatHandler } from './segment/textColorFormatHandler';
import { textColorOnTableCellFormatHandler } from './table/textColorOnTableCellFormatHandler';
import { textIndentFormatHandler } from './block/textIndentFormatHandler';
import { underlineFormatHandler } from './segment/underlineFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';
import { whiteSpaceFormatHandler } from './block/whiteSpaceFormatHandler';
import { wordBreakFormatHandler } from './common/wordBreakFormatHandler';
import type { FormatHandler } from './FormatHandler';
import type {
    ContentModelFormatMap,
    FormatApplier,
    FormatAppliers,
    FormatHandlerTypeMap,
    FormatKey,
    FormatParser,
    FormatParsers,
} from 'roosterjs-content-model-types';

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
    float: floatFormatHandler,
    fontFamily: fontFamilyFormatHandler,
    fontSize: fontSizeFormatHandler,
    entity: entityFormatHandler,
    htmlAlign: htmlAlignFormatHandler,
    id: idFormatHandler,
    italic: italicFormatHandler,
    letterSpacing: letterSpacingFormatHandler,
    lineHeight: lineHeightFormatHandler,
    link: linkFormatHandler,
    listItemThread: listItemThreadFormatHandler,
    listLevelThread: listLevelThreadFormatHandler,
    listStyle: listStyleFormatHandler,
    margin: marginFormatHandler,
    padding: paddingFormatHandler,
    size: sizeFormatHandler,
    strike: strikeFormatHandler,
    superOrSubScript: superOrSubScriptFormatHandler,
    tableLayout: tableLayoutFormatHandler,
    tableSpacing: tableSpacingFormatHandler,
    textAlign: textAlignFormatHandler,
    textColor: textColorFormatHandler,
    textColorOnTableCell: textColorOnTableCellFormatHandler,
    textIndent: textIndentFormatHandler,
    underline: underlineFormatHandler,
    verticalAlign: verticalAlignFormatHandler,
    whiteSpace: whiteSpaceFormatHandler,
    wordBreak: wordBreakFormatHandler,
};

const styleBasedSegmentFormats: (keyof FormatHandlerTypeMap)[] = [
    'letterSpacing',
    'fontFamily',
    'fontSize',
];

const elementBasedSegmentFormats: (keyof FormatHandlerTypeMap)[] = [
    'strike',
    'underline',
    'superOrSubScript',
    'italic',
    'bold',
];
const sharedBlockFormats: (keyof FormatHandlerTypeMap)[] = [
    'direction',
    'textAlign',
    'textIndent',
    'lineHeight',
    'whiteSpace',
];
const sharedContainerFormats: (keyof FormatHandlerTypeMap)[] = [
    'backgroundColor',
    'margin',
    'padding',
    'border',
];

/**
 * @internal
 */
export const defaultFormatKeysPerCategory: {
    [key in keyof ContentModelFormatMap]: (keyof FormatHandlerTypeMap)[];
} = {
    block: sharedBlockFormats,
    listItemThread: ['listItemThread'],
    listLevelThread: ['listLevelThread'],
    listItemElement: [
        ...sharedBlockFormats,
        'direction',
        'textAlign',
        'lineHeight',
        'margin',
        'listStyle',
    ],
    listLevel: ['direction', 'textAlign', 'margin', 'padding', 'listStyle', 'backgroundColor'],
    styleBasedSegment: [...styleBasedSegmentFormats, 'textColor', 'backgroundColor', 'lineHeight'],
    elementBasedSegment: elementBasedSegmentFormats,
    segment: [
        ...styleBasedSegmentFormats,
        ...elementBasedSegmentFormats,
        'textColor',
        'backgroundColor',
        'lineHeight',
    ],
    segmentOnBlock: [...styleBasedSegmentFormats, ...elementBasedSegmentFormats, 'textColor'],
    segmentOnTableCell: [
        ...styleBasedSegmentFormats,
        ...elementBasedSegmentFormats,
        'textColorOnTableCell',
    ],
    tableCell: [
        'border',
        'backgroundColor',
        'padding',
        'verticalAlign',
        'wordBreak',
        'textColor',
        'htmlAlign',
        'size',
    ],
    tableRow: ['backgroundColor'],
    tableColumn: ['size'],
    table: [
        'id',
        'border',
        'backgroundColor',
        'display',
        'htmlAlign',
        'margin',
        'size',
        'tableLayout',
        'textColor',
    ],
    tableBorder: ['borderBox', 'tableSpacing'],
    tableCellBorder: ['borderBox'],
    image: [
        'id',
        'size',
        'margin',
        'padding',
        'borderBox',
        'border',
        'boxShadow',
        'display',
        'float',
        'verticalAlign',
    ],
    link: [
        'link',
        'textColor',
        'underline',
        'display',
        'margin',
        'padding',
        'backgroundColor',
        'border',
        'size',
        'textAlign',
    ],
    segmentUnderLink: ['textColor'],
    code: ['fontFamily', 'display'],
    dataset: ['dataset'],
    divider: [...sharedBlockFormats, ...sharedContainerFormats, 'display', 'size', 'htmlAlign'],
    container: [...sharedContainerFormats, 'htmlAlign', 'size', 'display'],
    entity: ['entity'],
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
