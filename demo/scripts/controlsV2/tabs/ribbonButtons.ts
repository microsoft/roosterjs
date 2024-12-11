import { changeImageButton } from '../demoButtons/changeImageButton';
import { createFormatPainterButton } from '../demoButtons/formatPainterButton';
import { createImageEditButtons } from '../demoButtons/createImageEditButtons';
import { FormatPainterPlugin } from '../plugins/FormatPainterPlugin';
import { formatTableButton } from '../demoButtons/formatTableButton';
import { imageBorderColorButton } from '../demoButtons/imageBorderColorButton';
import { imageBorderRemoveButton } from '../demoButtons/imageBorderRemoveButton';
import { imageBorderStyleButton } from '../demoButtons/imageBorderStyleButton';
import { imageBorderWidthButton } from '../demoButtons/imageBorderWidthButton';
import { imageBoxShadowButton } from '../demoButtons/imageBoxShadowButton';
import { ImageEditor } from 'roosterjs-content-model-types';
import { listStartNumberButton } from '../demoButtons/listStartNumberButton';
import { pasteButton } from '../demoButtons/pasteButton';
import { setBulletedListStyleButton } from '../demoButtons/setBulletedListStyleButton';
import { setNumberedListStyleButton } from '../demoButtons/setNumberedListStyleButton';
import { setTableCellShadeButton } from '../demoButtons/setTableCellShadeButton';
import { spaceAfterButton, spaceBeforeButton } from '../demoButtons/spaceBeforeAfterButtons';
import { spacingButton } from '../demoButtons/spacingButton';
import { tableBorderApplyButton } from '../demoButtons/tableBorderApplyButton';
import { tableBorderColorButton } from '../demoButtons/tableBorderColorButton';
import { tableBorderStyleButton } from '../demoButtons/tableBorderStyleButton';
import { tableBorderWidthButton } from '../demoButtons/tableBorderWidthButton';
import { tableOptionsButton } from '../demoButtons/tableOptionsButton';
import { tableTitleButton } from '../demoButtons/tableTitleButton';
import { tabNames } from './getTabs';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from '../demoButtons/tableEditButtons';
import type { RibbonButton } from 'roosterjs-react';
import {
    alignCenterButton,
    alignJustifyButton,
    alignLeftButton,
    alignRightButton,
    backgroundColorButton,
    blockQuoteButton,
    boldButton,
    bulletedListButton,
    clearFormatButton,
    codeButton,
    decreaseFontSizeButton,
    decreaseIndentButton,
    fontButton,
    fontSizeButton,
    increaseFontSizeButton,
    increaseIndentButton,
    insertImageButton,
    insertLinkButton,
    insertTableButton,
    italicButton,
    ltrButton,
    numberedListButton,
    removeLinkButton,
    rtlButton,
    setHeadingLevelButton,
    strikethroughButton,
    subscriptButton,
    superscriptButton,
    textColorButton,
    underlineButton,
} from 'roosterjs-react';

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
    tableTitleButton,
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
    tableTitleButton,
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
export function getButtons(
    id: tabNames,
    formatPlainerPlugin?: FormatPainterPlugin,
    imageEditor?: ImageEditor
) {
    switch (id) {
        case 'text':
            return [createFormatPainterButton(formatPlainerPlugin), ...textButtons];
        case 'paragraph':
            return paragraphButtons;
        case 'insert':
            return insertButtons;
        case 'image':
            return imageEditor
                ? [...imageButtons, ...createImageEditButtons(imageEditor)]
                : imageButtons;
        case 'table':
            return tableButtons;
        case 'all':
            return [createFormatPainterButton(formatPlainerPlugin), ...allButtons];
    }
}
