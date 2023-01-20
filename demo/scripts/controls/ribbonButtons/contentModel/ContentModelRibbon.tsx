import * as React from 'react';
import { bulletedListButton } from './bulletedListButton';
import { clearFormatButton } from './clearFormatButton';
import { decreaseFontSizeButton } from './decreaseFontSizeButton';
import { decreaseIndentButton } from './decreaseIndentButton';
import { fontButton } from './fontButton';
import { fontSizeButton } from './fontSizeButton';
import { formatPainterButton } from './formatPainterButton';
import { formatTableButton } from './formatTableButton';
import { increaseIndentButton } from './increaseIndentButton';
import { insertImageButton } from './insertImageButton';
import { insertLinkButton } from './insertLinkButton';
import { insertTableButton } from './insertTableButton';
import { listStartNumberButton } from './listStartNumberButton';
import { numberedListButton } from './numberedListButton';
import { removeLinkButton } from './removeLinkButton';
import { Ribbon, RibbonPlugin } from 'roosterjs-react';
import { setBulletedListStyleButton } from './setBulletedListStyleButton';
import { setNumberedListStyleButton } from './setNumberedListStyleButton';
import { setTableCellShadeButton } from './setTableCellShadeButton';
import { setTableHeaderButton } from './setTableHeaderButton';
import { strikethroughButton } from './strikethroughButton';
import { subscriptButton } from './subscriptButton';
import { superscriptButton } from './superscriptButton';
import { textColorButton } from './textColorButton';
import { underlineButton } from './underlineButton';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from './tableEditButtons';
import { spacingButton } from './spacingButton';

const buttons = [
    formatPainterButton,
    boldButton,
    italicButton,
    underlineButton,
    fontButton,
    fontSizeButton,
    increaseFontSizeButton,
    decreaseFontSizeButton,
    textColorButton,
    backgroundColorButton,
    bulletedListButton,
    numberedListButton,
    decreaseIndentButton,
    increaseIndentButton,
    blockQuoteButton,
    alignLeftButton,
    alignCenterButton,
    alignRightButton,
    insertLinkButton,
    removeLinkButton,
    insertTableButton,
    insertImageButton,
    superscriptButton,
    subscriptButton,
    strikethroughButton,
    setHeaderLevelButton,
    ltrButton,
    rtlButton,
    clearFormatButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
    formatTableButton,
    setTableCellShadeButton,
    setTableHeaderButton,
    tableInsertButton,
    tableDeleteButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
    imageBorderColorButton,
    imageBorderWidthButton,
    imageBorderStyleButton,
    changeImageButton,
    imageBoxShadowButton,
    spacingButton,
];

export default function ContentModelRibbon(props: { ribbonPlugin: RibbonPlugin; isRtl: boolean }) {
    const { ribbonPlugin, isRtl } = props;

    return <Ribbon buttons={buttons} plugin={ribbonPlugin} dir={isRtl ? 'rtl' : 'ltr'} />;
}
