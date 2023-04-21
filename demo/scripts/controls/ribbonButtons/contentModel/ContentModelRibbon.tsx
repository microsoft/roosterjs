import * as React from 'react';
import { alignCenterButton } from './alignCenterButton';
import { alignLeftButton } from './alignLeftButton';
import { alignRightButton } from './alignRightButton';
import { backgroundColorButton } from './backgroundColorButton';
import { blockQuoteButton } from './blockQuoteButton';
import { boldButton } from './boldButton';
import { bulletedListButton } from './bulletedListButton';
import { changeImageButton } from './changeImageButton';
import { clearFormatButton } from './clearFormatButton';
import { codeButton } from './codeButton';
import { decreaseFontSizeButton } from './decreaseFontSizeButton';
import { decreaseIndentButton } from './decreaseIndentButton';
import { fontButton } from './fontButton';
import { fontSizeButton } from './fontSizeButton';
import { formatPainterButton } from './formatPainterButton';
import { formatTableButton } from './formatTableButton';
import { imageBorderColorButton } from './imageBorderColorButton';
import { imageBorderStyleButton } from './imageBorderStyleButton';
import { imageBorderWidthButton } from './imageBorderWidthButton';
import { imageBorderRemoveButton } from './imageBorderRemoveButton';
import { imageBoxShadowButton } from './imageBoxShadowButton';
import { increaseFontSizeButton } from './increaseFontSizeButton';
import { increaseIndentButton } from './increaseIndentButton';
import { insertImageButton } from './insertImageButton';
import { insertLinkButton } from './insertLinkButton';
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
import { spaceAfterButton, spaceBeforeButton } from './spaceBeforeAfterButtons';
import { spacingButton } from './spacingButton';
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
    codeButton,
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
    imageBorderRemoveButton,
    changeImageButton,
    imageBoxShadowButton,
    spacingButton,
    spaceBeforeButton,
    spaceAfterButton,
];

export default function ContentModelRibbon(props: { ribbonPlugin: RibbonPlugin; isRtl: boolean }) {
    const { ribbonPlugin, isRtl } = props;

    return <Ribbon buttons={buttons} plugin={ribbonPlugin} dir={isRtl ? 'rtl' : 'ltr'} />;
}
