import { isContentModelEditor } from 'roosterjs-content-model';
import { NumberingListType } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';
import { setListStyle } from 'roosterjs-content-model';

const dropDownMenuItems = {
    [NumberingListType.Decimal]: 'Decimal',
    [NumberingListType.DecimalDash]: 'DecimalDash',
    [NumberingListType.DecimalParenthesis]: 'DecimalParenthesis',
    [NumberingListType.DecimalDoubleParenthesis]: 'DecimalDoubleParenthesis',
    [NumberingListType.LowerAlpha]: 'LowerAlpha',
    [NumberingListType.LowerAlphaParenthesis]: 'LowerAlphaParenthesis',
    [NumberingListType.LowerAlphaDoubleParenthesis]: 'LowerAlphaDoubleParenthesis',
    [NumberingListType.LowerAlphaDash]: 'LowerAlphaDash',
    [NumberingListType.UpperAlpha]: 'UpperAlpha',
    [NumberingListType.UpperAlphaParenthesis]: 'UpperAlphaParenthesis',
    [NumberingListType.UpperAlphaDoubleParenthesis]: 'UpperAlphaDoubleParenthesis',
    [NumberingListType.UpperAlphaDash]: 'UpperAlphaDash',
    [NumberingListType.LowerRoman]: 'LowerRoman',
    [NumberingListType.LowerRomanParenthesis]: 'LowerRomanParenthesis',
    [NumberingListType.LowerRomanDoubleParenthesis]: 'LowerRomanDoubleParenthesis',
    [NumberingListType.LowerRomanDash]: 'LowerRomanDash',
    [NumberingListType.UpperRoman]: 'UpperRoman',
    [NumberingListType.UpperRomanParenthesis]: 'UpperRomanParenthesis',
    [NumberingListType.UpperRomanDoubleParenthesis]: 'UpperRomanDoubleParenthesis',
    [NumberingListType.UpperRomanDash]: 'UpperRomanDash',
};

export const setNumberedListStyleButton: RibbonButton<'ribbonButtonNumberedListStyle'> = {
    key: 'ribbonButtonNumberedListStyle',
    dropDownMenu: { items: dropDownMenuItems },
    unlocalizedText: 'Set ordered list style',
    iconName: 'NumberedList',
    isDisabled: formatState => !formatState.isNumbering,
    onClick: (editor, key) => {
        const li = editor.getElementAtCursor('li') as HTMLLIElement;
        const value = parseInt(key) as NumberingListType;

        if (
            isContentModelEditor(editor) &&
            li &&
            value >= NumberingListType.Min &&
            value <= NumberingListType.Max
        ) {
            editor.select(li);

            setListStyle(editor, {
                orderedStyleType: value,
            });
        }
    },
};
