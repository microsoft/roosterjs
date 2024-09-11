import { CancelButtonStringKey, OkButtonStringKey, showInputDialog } from 'roosterjs-react';
import { setListStartNumber } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Bulleted list" button on the format ribbon
 */
export const listStartNumberButton: RibbonButton<
    | 'ribbonButtonSetStartNumber'
    | 'ribbonButtonSetStartNumberTo1'
    | 'ribbonButtonSetStartNumberCustomize'
    | OkButtonStringKey
    | CancelButtonStringKey
> = {
    key: 'ribbonButtonSetStartNumber',
    dropDownMenu: {
        items: {
            ribbonButtonSetStartNumberTo1: 'Restart at 1',
            ribbonButtonSetStartNumberCustomize: 'Start numbering value',
        },
    },
    unlocalizedText: 'Set list start number',
    iconName: 'NumberSymbol',
    isDisabled: formatState => !formatState.isNumbering,
    onClick: (editor, key, strings, uiUtility) => {
        if (key == 'ribbonButtonSetStartNumberCustomize') {
            showInputDialog(
                uiUtility,
                'ribbonButtonSetStartNumberCustomize',
                'Start numbering value',
                {
                    startNumber: {
                        labelKey: null,
                        unlocalizedLabel: null,
                        initValue: '1',
                    },
                },
                strings
            ).then(values => {
                const newValue = parseInt(values.startNumber);

                if (newValue > 0) {
                    setListStartNumber(editor, newValue);
                }
            });
        } else {
            setListStartNumber(editor, 1);
        }
    },
};
