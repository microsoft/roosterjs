import * as React from 'react';
import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

const classNames = mergeStyleSets({
    colorPickerContainer: {
        width: '192px',
        padding: '8px',
        background: 'white',
        overflow: 'hidden',
        '& ul': {
            width: '192px',
            overflow: 'hidden',
        },
    },
    colorMenuItem: {
        display: 'inline-block',
        width: '32px',
        height: '32px',
        background: 'white',
        '& button': {
            padding: '0px',
            minWidth: '0px',
            background: 'transparent',
            border: 'none',
        },
    },
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
 * Common part of a color picker button
 */
export const colorPicker: Pick<
    RibbonButton,
    'dropDownClassName' | 'itemClassName' | 'dropDownItemRender' | 'allowLivePreview'
> = {
    dropDownClassName: classNames.colorPickerContainer,
    itemClassName: classNames.colorMenuItem,
    allowLivePreview: true,
    dropDownItemRender: (item, onClick) => {
        return (
            <button onClick={e => onClick(e, item)}>
                <div
                    className={
                        classNames.colorSquare +
                        ' ' +
                        (item.key == '#ffffff'
                            ? classNames.colorSquareBorderWhite
                            : classNames.colorSquareBorder)
                    }
                    style={{
                        backgroundColor: item.key,
                    }}></div>
            </button>
        );
    },
};
