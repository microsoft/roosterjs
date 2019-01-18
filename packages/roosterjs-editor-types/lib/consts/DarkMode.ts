import DarkModeOptions from '../interface/DarkModeOptions';
import DefaultFormat from '../interface/DefaultFormat';

export const DARK_MODE_DEFAULT_FORMAT = <DefaultFormat>{
    backgroundColor: 'rgb(51,51,51)',
    textColor: 'rgb(255,255,255)',
    originalSourceBackgroundColor: 'rgb(255,255,255)',
    originalSourceTextColor: 'rgb(0,0,0)',
}

export const DARK_MODE_DEFAULT_OPTIONS = <DarkModeOptions>{
    defaultFormat: DARK_MODE_DEFAULT_FORMAT
}