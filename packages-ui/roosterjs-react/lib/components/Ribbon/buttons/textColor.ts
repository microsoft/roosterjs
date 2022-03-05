import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { colorPicker } from './colorPicker';
import { setTextColor } from 'roosterjs-editor-api';

const TextColors = {
    '#51a7f9': '#0075c2',
    '#6fc040': '#207a00',
    '#f5d427': '#5d4d00',
    '#f3901d': '#ab5500',
    '#ed5c57': '#df504d',
    '#b36ae2': '#ab63da',
    '#0c64c0': '#6da0ff',
    '#0c882a': '#3da848',
    '#dcbe22': '#6d5c00',
    '#de6a19': '#d3610c',
    '#c82613': '#ff6847',
    '#763e9b': '#d394f9',
    '#174e86': '#93b8f9',
    '#0f5c1a': '#7fc57b',
    '#c3971d': '#946f00',
    '#be5b17': '#de7633',
    '#861106': '#ff9b7c',
    '#5e327c': '#dea9fd',
    '#002451': '#cedbff',
    '#06400c': '#a3da9b',
    '#a37519': '#b5852a',
    '#934511': '#ef935c',
    '#570606': '#ffc0b1',
    '#3b204d': '#eecaff',
    '#ffffff': '#333333',
    '#cccccc': '#535353',
    '#999999': '#777777',
    '#666666': '#a0a0a0',
    '#333333': '#cfcfcf',
    '#000000': '#ffffff',
};

/**
 * "Text color" button on the format ribbon
 */
export const textColor: RibbonButton = {
    ...colorPicker,
    key: 'textColor',
    unlocalizedText: 'Text color',
    iconName: 'FontColor',
    dropDownItems: TextColors,
    onClick: (editor, key) => {
        setTextColor(editor, {
            lightModeColor: key,
            darkModeColor: TextColors[key as keyof typeof TextColors],
        });
    },
};
