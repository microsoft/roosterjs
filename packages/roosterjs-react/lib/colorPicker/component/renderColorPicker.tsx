import * as React from 'react';
import { BackgroundColorDropDownItems, BackgroundColors } from '../utils/backgroundColors';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TextColorDropDownItems, TextColors } from '../utils/textColors';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../utils/getClassNamesForColorPicker';
import type { RibbonButtonDropDown } from '../../ribbon/type/RibbonButtonDropDown';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import type { Colors } from 'roosterjs-content-model-types';

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
 * Render a color picker
 * @param item Color items
 * @param colorDef Definition of colors
 * @param onClick On click event handler
 */
export function renderColorPicker<Strings extends string>(
    item: IContextualMenuItem,
    colorDef: Record<Strings, Colors>,
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

/**
 * Get a drop down data object of color picker used by drop down button
 * @param colorSet The set of color, text or background
 * @returns The color picker drop down for ribbon button
 */
export function getColorPickerDropDown(colorSet: 'text' | 'background'): RibbonButtonDropDown {
    return {
        items: colorSet == 'background' ? BackgroundColorDropDownItems : TextColorDropDownItems,
        itemClassName: getColorPickerItemClassName(),
        allowLivePreview: true,
        itemRender:
            colorSet == 'background'
                ? (item, onClick) => renderColorPicker(item, BackgroundColors, onClick)
                : (item, onClick) => renderColorPicker(item, TextColors, onClick),
        commandBarSubMenuProperties: {
            className: getColorPickerContainerClassName(),
        },
    };
}
