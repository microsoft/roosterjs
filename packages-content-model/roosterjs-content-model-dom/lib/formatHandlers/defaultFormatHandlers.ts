import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { borderBoxFormatHandler } from './common/borderBoxFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { boxShadowFormatHandler } from './common/boxShadowFormatHandler';
import { datasetFormatHandler } from './common/datasetFormatHandler';
import { directionFormatHandler } from './block/directionFormatHandler';
import { displayFormatHandler } from './block/displayFormatHandler';
import { floatFormatHandler } from './common/floatFormatHandler';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatHandler } from './FormatHandler';
import { htmlAlignFormatHandler } from './block/htmlAlignFormatHandler';
import { idFormatHandler } from './common/idFormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { letterSpacingFormatHandler } from './segment/letterSpacingFormatHandler';
import { lineHeightFormatHandler } from './block/lineHeightFormatHandler';
import { linkFormatHandler } from './segment/linkFormatHandler';
import { listItemThreadFormatHandler } from './list/listItemThreadFormatHandler';
import { listLevelThreadFormatHandler } from './list/listLevelThreadFormatHandler';
import { listStylePositionFormatHandler } from './list/listStylePositionFormatHandler';
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
import { underlineFormatHandler } from './segment/underlineFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';
import { whiteSpaceFormatHandler } from './block/whiteSpaceFormatHandler';
import { wordBreakFormatHandler } from './common/wordBreakFormatHandler';
import {
    ContentModelFormatMap,
    FormatHandlerTypeMap,
    FormatKey,
} from 'roosterjs-content-model-types';

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
    boxShadow: boxShadowFormatHandler,
    dataset: datasetFormatHandler,
    direction: directionFormatHandler,
    display: displayFormatHandler,
    float: floatFormatHandler,
    fontFamily: fontFamilyFormatHandler,
    fontSize: fontSizeFormatHandler,
    htmlAlign: htmlAlignFormatHandler,
    id: idFormatHandler,
    italic: italicFormatHandler,
    letterSpacing: letterSpacingFormatHandler,
    lineHeight: lineHeightFormatHandler,
    link: linkFormatHandler,
    listItemThread: listItemThreadFormatHandler,
    listLevelThread: listLevelThreadFormatHandler,
    listStylePosition: listStylePositionFormatHandler,
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
    listItem: ['listItemThread'],
    listItemElement: [...sharedBlockFormats, 'direction', 'textAlign', 'lineHeight', 'margin'],
    listLevel: [
        'listLevelThread',
        'direction',
        'textAlign',
        'margin',
        'padding',
        'listStylePosition',
        'backgroundColor',
    ],
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
    table: [
        'id',
        'border',
        'backgroundColor',
        'display',
        'htmlAlign',
        'margin',
        'size',
        'tableLayout',
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
};
