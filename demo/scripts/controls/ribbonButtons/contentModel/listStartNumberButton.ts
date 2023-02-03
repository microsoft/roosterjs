import showInputDialog from 'roosterjs-react/lib/inputDialog/utils/showInputDialog';
import { CancelButtonStringKey, OkButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';
import { setListStartNumber } from 'roosterjs-content-model';

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
        const li = editor.getElementAtCursor('li') as HTMLLIElement;

        if (li && isContentModelEditor(editor)) {
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
                        editor.select(li);
                        setListStartNumber(editor, newValue);
                    }
                });
            } else {
                editor.select(li);
                setListStartNumber(editor, 1);
            }
        }

        return true;
    },
};
