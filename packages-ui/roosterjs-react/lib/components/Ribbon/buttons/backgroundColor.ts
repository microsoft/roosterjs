import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { colorPicker } from './colorPicker';
import { setBackgroundColor } from 'roosterjs-editor-api';

const BackgroundColors = {
    '#00ffff': '#005357',
    '#00ff00': '#005e00',
    '#ffff00': '#383e00',
    '#ff8000': '#bf4c00',
    '#ff0000': '#ff2711',
    '#ff00ff': '#e700e8',
    '#80ffff': '#004c4f',
    '#80ff80': '#005400',
    '#ffff80': '#343c00',
    '#ffc080': '#77480b',
    '#ff8080': '#bc454a',
    '#ff80ff': '#aa2bad',
    '#ffffff': '#333333',
    '#cccccc': '#535353',
    '#999999': '#777777',
    '#666666': '#a0a0a0',
    '#333333': '#cfcfcf',
    '#000000': '#ffffff',
};

/**
 * "Background color" button on the format ribbon
 */
export const backgroundColor: RibbonButton = {
    ...colorPicker,
    key: 'backgroundColor',
    unlocalizedText: 'Background color',
    iconName: 'FabricTextHighlight',
    dropDownItems: BackgroundColors,
    onClick: (editor, key) => {
        setBackgroundColor(editor, {
            lightModeColor: key,
            darkModeColor: BackgroundColors[key as keyof typeof BackgroundColors],
        });
    },
};
