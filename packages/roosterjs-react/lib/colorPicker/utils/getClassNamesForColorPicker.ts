import { mergeStyleSets } from '@fluentui/react/lib/Styling';

const classNames = mergeStyleSets({
    colorPickerContainer: {
        width: '192px',
        padding: '8px',
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
        '& button': {
            padding: '0px',
            minWidth: '0px',
            background: 'transparent',
            border: 'none',
        },
    },
});

/**
 * @internal
 */
export function getColorPickerContainerClassName() {
    return classNames.colorPickerContainer;
}

/**
 * @internal
 */
export function getColorPickerItemClassName() {
    return classNames.colorMenuItem;
}
