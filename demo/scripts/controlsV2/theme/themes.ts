import { PartialTheme } from '@fluentui/react/lib/Theme';

const LightTheme: PartialTheme = {
    palette: {
        themePrimary: '#cc6688',
        themeLighterAlt: '#080405',
        themeLighter: '#211016',
        themeLight: '#3d1f29',
        themeTertiary: '#7a3d52',
        themeSecondary: '#b45a78',
        themeDarkAlt: '#d17392',
        themeDark: '#d886a1',
        themeDarker: '#e2a3b8',
        neutralLighterAlt: '#f8f8f8',
        neutralLighter: '#f4f4f4',
        neutralLight: '#eaeaea',
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#595959',
        neutralSecondary: '#373737',
        neutralPrimaryAlt: '#2f2f2f',
        neutralPrimary: '#000000',
        neutralDark: '#151515',
        black: '#0b0b0b',
        white: '#ffffff',
    },
};

const DarkTheme: PartialTheme = {
    palette: {
        themePrimary: '#cb6587',
        themeLighterAlt: '#fdf8fa',
        themeLighter: '#f7e3ea',
        themeLight: '#f0ccd8',
        themeTertiary: '#e09db4',
        themeSecondary: '#d27694',
        themeDarkAlt: '#b85c7a',
        themeDark: '#9b4e67',
        themeDarker: '#72394c',
        neutralLighterAlt: '#3c3c3c',
        neutralLighter: '#444444',
        neutralLight: '#515151',
        neutralQuaternaryAlt: '#595959',
        neutralQuaternary: '#5f5f5f',
        neutralTertiaryAlt: '#7a7a7a',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#333333',
    },
};

export function getTheme(isDark: boolean): PartialTheme {
    return isDark ? DarkTheme : LightTheme;
}
