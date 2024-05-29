import { alignCenterButton } from '../roosterjsReact/ribbon/buttons/alignCenterButton';
import { alignJustifyButton } from '../roosterjsReact/ribbon/buttons/alignJustifyButton';
import { alignLeftButton } from '../roosterjsReact/ribbon/buttons/alignLeftButton';
import { alignRightButton } from '../roosterjsReact/ribbon/buttons/alignRightButton';
import { backgroundColorButton } from '../roosterjsReact/ribbon/buttons/backgroundColorButton';
import { blockQuoteButton } from '../roosterjsReact/ribbon/buttons/blockQuoteButton';
import { boldButton } from '../roosterjsReact/ribbon/buttons/boldButton';
import { bulletedListButton } from '../roosterjsReact/ribbon/buttons/bulletedListButton';
import { changeImageButton } from '../demoButtons/changeImageButton';
import { clearFormatButton } from '../roosterjsReact/ribbon/buttons/clearFormatButton';
import { codeButton } from '../roosterjsReact/ribbon/buttons/codeButton';
import { createFormatPainterButton } from '../demoButtons/formatPainterButton';
import { decreaseFontSizeButton } from '../roosterjsReact/ribbon/buttons/decreaseFontSizeButton';
import { decreaseIndentButton } from '../roosterjsReact/ribbon/buttons/decreaseIndentButton';
import { fontButton } from '../roosterjsReact/ribbon/buttons/fontButton';
import { fontSizeButton } from '../roosterjsReact/ribbon/buttons/fontSizeButton';
import { FormatPainterPlugin } from '../plugins/FormatPainterPlugin';
import { formatTableButton } from '../demoButtons/formatTableButton';
import { imageBorderColorButton } from '../demoButtons/imageBorderColorButton';
import { imageBorderRemoveButton } from '../demoButtons/imageBorderRemoveButton';
import { imageBorderStyleButton } from '../demoButtons/imageBorderStyleButton';
import { imageBorderWidthButton } from '../demoButtons/imageBorderWidthButton';
import { imageBoxShadowButton } from '../demoButtons/imageBoxShadowButton';
import { increaseFontSizeButton } from '../roosterjsReact/ribbon/buttons/increaseFontSizeButton';
import { increaseIndentButton } from '../roosterjsReact/ribbon/buttons/increaseIndentButton';
import { insertImageButton } from '../roosterjsReact/ribbon/buttons/insertImageButton';
import { insertLinkButton } from '../roosterjsReact/ribbon/buttons/insertLinkButton';
import { insertTableButton } from '../roosterjsReact/ribbon/buttons/insertTableButton';
import { italicButton } from '../roosterjsReact/ribbon/buttons/italicButton';
import { listStartNumberButton } from '../demoButtons/listStartNumberButton';
import { ltrButton } from '../roosterjsReact/ribbon/buttons/ltrButton';
import { numberedListButton } from '../roosterjsReact/ribbon/buttons/numberedListButton';
import { pasteButton } from '../demoButtons/pasteButton';
import { removeLinkButton } from '../roosterjsReact/ribbon/buttons/removeLinkButton';
import { rtlButton } from '../roosterjsReact/ribbon/buttons/rtlButton';
import { setBulletedListStyleButton } from '../demoButtons/setBulletedListStyleButton';
import { setHeadingLevelButton } from '../roosterjsReact/ribbon/buttons/setHeadingLevelButton';
import { setNumberedListStyleButton } from '../demoButtons/setNumberedListStyleButton';
import { setTableCellShadeButton } from '../demoButtons/setTableCellShadeButton';
import { spaceAfterButton, spaceBeforeButton } from '../demoButtons/spaceBeforeAfterButtons';
import { spacingButton } from '../demoButtons/spacingButton';
import { strikethroughButton } from '../roosterjsReact/ribbon/buttons/strikethroughButton';
import { subscriptButton } from '../roosterjsReact/ribbon/buttons/subscriptButton';
import { superscriptButton } from '../roosterjsReact/ribbon/buttons/superscriptButton';
import { tableBorderApplyButton } from '../demoButtons/tableBorderApplyButton';
import { tableBorderColorButton } from '../demoButtons/tableBorderColorButton';
import { tableBorderStyleButton } from '../demoButtons/tableBorderStyleButton';
import { tableBorderWidthButton } from '../demoButtons/tableBorderWidthButton';
import { tableOptionsButton } from '../demoButtons/tableOptionsButton';
import { tabNames } from './getTabs';
import { textColorButton } from '../roosterjsReact/ribbon/buttons/textColorButton';
import { underlineButton } from '../roosterjsReact/ribbon/buttons/underlineButton';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from '../demoButtons/tableEditButtons';
import type { RibbonButton } from '../roosterjsReact/ribbon';

const textButtons: RibbonButton<any>[] = [
    boldButton,
    italicButton,
    underlineButton,
    fontButton,
    fontSizeButton,
    increaseFontSizeButton,
    decreaseFontSizeButton,
    textColorButton,
    backgroundColorButton,
    superscriptButton,
    subscriptButton,
    strikethroughButton,
];

const tableButtons: RibbonButton<any>[] = [
    insertTableButton,
    formatTableButton,
    setTableCellShadeButton,
    tableOptionsButton,
    tableInsertButton,
    tableDeleteButton,
    tableBorderApplyButton,
    tableBorderColorButton,
    tableBorderWidthButton,
    tableBorderStyleButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
];

const imageButtons: RibbonButton<any>[] = [
    insertImageButton,
    imageBorderColorButton,
    imageBorderWidthButton,
    imageBorderStyleButton,
    imageBorderRemoveButton,
    changeImageButton,
    imageBoxShadowButton,
];

const insertButtons: RibbonButton<any>[] = [
    insertLinkButton,
    removeLinkButton,
    insertTableButton,
    insertImageButton,
];

const paragraphButtons: RibbonButton<any>[] = [
    bulletedListButton,
    numberedListButton,
    decreaseIndentButton,
    increaseIndentButton,
    blockQuoteButton,
    alignLeftButton,
    alignCenterButton,
    alignRightButton,
    alignJustifyButton,
    setHeadingLevelButton,
    codeButton,
    ltrButton,
    rtlButton,
    clearFormatButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
    spacingButton,
    spaceBeforeButton,
    spaceAfterButton,
    pasteButton,
];

const allButtons: RibbonButton<any>[] = [
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
    alignJustifyButton,
    insertLinkButton,
    removeLinkButton,
    insertTableButton,
    insertImageButton,
    superscriptButton,
    subscriptButton,
    strikethroughButton,
    setHeadingLevelButton,
    codeButton,
    ltrButton,
    rtlButton,
    clearFormatButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
    formatTableButton,
    setTableCellShadeButton,
    tableOptionsButton,
    tableInsertButton,
    tableDeleteButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
    tableBorderApplyButton,
    tableBorderColorButton,
    tableBorderWidthButton,
    tableBorderStyleButton,
    imageBorderColorButton,
    imageBorderWidthButton,
    imageBorderStyleButton,
    imageBorderRemoveButton,
    changeImageButton,
    imageBoxShadowButton,
    spacingButton,
    spaceBeforeButton,
    spaceAfterButton,
    pasteButton,
];
export function getButtons(id: tabNames, formatPlainerPlugin?: FormatPainterPlugin) {
    switch (id) {
        case 'text':
            return [createFormatPainterButton(formatPlainerPlugin), ...textButtons];
        case 'paragraph':
            return paragraphButtons;
        case 'insert':
            return insertButtons;
        case 'image':
            return imageButtons;
        case 'table':
            return tableButtons;
        case 'all':
            return [createFormatPainterButton(formatPlainerPlugin), ...allButtons];
    }
}
