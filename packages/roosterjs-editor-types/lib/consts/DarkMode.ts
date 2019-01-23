import DarkModeOptions from '../interface/DarkModeOptions';
import DefaultFormat from '../interface/DefaultFormat';

export const DARK_MODE_DEFAULT_FORMAT = <DefaultFormat>{
    backgroundColors: {
        darkModeColor: 'rgb(51,51,51)',
        lightModeColor: 'rgb(255,255,255)',
    },
    textColors: {
        darkModeColor: 'rgb(255,255,255)',
        lightModeColor: 'rgb(0,0,0)',
    }
}