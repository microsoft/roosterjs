import * as React from 'react';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ModeIndependentColor } from 'roosterjs-editor-types';

const classNames = mergeStyleSets({
    colorSquare: {
        width: '20px',
        height: '20px',
        margin: '4px',
        borderStyle: 'solid',
        borderWidth: '2px',
        '&:hover': {
            borderColor: 'red',
        },
    },
    colorSquareBorder: {
        borderColor: 'transparent',
    },
    colorSquareBorderWhite: {
        borderColor: '#bebebe',
    },
});

/**
 * @internal
 */
export function renderColorPicker<Strings extends string>(
    item: IContextualMenuItem,
    colorDef: Record<Strings, ModeIndependentColor>,
    onClick: (
        e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
        item: IContextualMenuItem
    ) => void
) {
    const key = item.key as Strings;
    const buttonColor = colorDef[key].lightModeColor;

    return (
        <button onClick={e => onClick(e, item)} title={item.text}>
            <div
                className={
                    classNames.colorSquare +
                    ' ' +
                    (key == 'textColorWhite' || key == 'backgroundColorWhite'
                        ? classNames.colorSquareBorderWhite
                        : classNames.colorSquareBorder)
                }
                style={{
                    backgroundColor: buttonColor,
                }}></div>
        </button>
    );
}
