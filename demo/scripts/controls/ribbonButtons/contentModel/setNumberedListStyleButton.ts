import ContentModelRibbonButton from './ContentModelRibbonButton';
import { NumberingListType } from 'roosterjs-content-model-types';
import { setListStyle } from 'roosterjs-content-model-editor';

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

export const setNumberedListStyleButton: ContentModelRibbonButton<'ribbonButtonNumberedListStyle'> = {
    key: 'ribbonButtonNumberedListStyle',
    dropDownMenu: { items: dropDownMenuItems },
    unlocalizedText: 'Set ordered list style',
    iconName: 'NumberedList',
    isDisabled: formatState => !formatState.isNumbering,
    onClick: (editor, key) => {
        const value = parseInt(key) as NumberingListType;

        setListStyle(editor, {
            orderedStyleType: value,
        });
    },
};
