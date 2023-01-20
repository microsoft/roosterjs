import * as React from 'react';
import { alignCenterButton } from './alignCenterButton';
import { alignLeftButton } from './alignLeftButton';
import { alignRightButton } from './alignRightButton';
import { backgroundColorButton } from './backgroundColorButton';
import { blockQuoteButton } from './blockQuoteButton';
import { boldButton } from './boldButton';
import { bulletedListButton } from './bulletedListButton';
import { clearFormatButton } from './clearFormatButton';
import { decreaseFontSizeButton } from './decreaseFontSizeButton';
import { decreaseIndentButton } from './decreaseIndentButton';
import { fontButton } from './fontButton';
import { fontSizeButton } from './fontSizeButton';
import { formatTableButton } from './formatTableButton';
import { imageBorderColor } from './setImageBorderColor';
import { imageBorderStyle } from './setImageBorderStyle';
import { imageBorderWidth } from './setImageBorderWidth';
import { imageBoxShadow } from './setImageBoxShadow';
import { increaseFontSizeButton } from './increaseFontSizeButton';
import { increaseIndentButton } from './increaseIndentButton';
import { insertImageButton } from './insertImageButton';
import { insertLinkButton } from './insertLinkButton';
import { insertNewImage } from './changeImage';
import { insertTableButton } from './insertTableButton';
import { italicButton } from './italicButton';
import { listStartNumberButton } from './listStartNumberButton';
import { ltrButton } from './ltrButton';
import { numberedListButton } from './numberedListButton';
import { removeLinkButton } from './removeLinkButton';
import { Ribbon, RibbonPlugin } from 'roosterjs-react';
import { rtlButton } from './rtlButton';
import { setBulletedListStyleButton } from './setBulletedListStyleButton';
import { setHeaderLevelButton } from './setHeaderLevelButton';
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

const buttons = [
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
    imageBorderColor,
    imageBorderWidth,
    imageBorderStyle,
    insertNewImage,
    imageBoxShadow,
];

export default function ContentModelRibbon(props: { ribbonPlugin: RibbonPlugin; isRtl: boolean }) {
    const { ribbonPlugin, isRtl } = props;

    return <Ribbon buttons={buttons} plugin={ribbonPlugin} dir={isRtl ? 'rtl' : 'ltr'} />;
}
