import createEditorCore from './createMockEditorCore';
import { getDefaultFormat } from '../../lib/coreApi/getDefaultFormat';

describe('getDefaultFormat', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        div.style.fontFamily = 'arial';
        div.style.fontSize = '14pt';
        div.style.color = 'black';
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('not force recalculate', () => {
        const core = createEditorCore(div, {});
        getDefaultFormat(core, false);
        expect(core.lifecycle.value.defaultFormat).toBeNull();
    });

    it('no default format, light mode', () => {
        const core = createEditorCore(div, {});
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(0, 0, 0)',
            textColors: undefined,
            backgroundColor: '',
            backgroundColors: undefined,
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });
    });

    it('no default format, dark mode', () => {
        const core = createEditorCore(div, {
            inDarkMode: true,
        });

        // First time it initials the default format
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(0, 0, 0)',
            textColors: undefined,
            backgroundColor: '',
            backgroundColors: undefined,
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });

        // Second time it calculate default format for dark mode
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(255,255,255)',
            textColors: {
                darkModeColor: 'rgb(255,255,255)',
                lightModeColor: 'rgb(0,0,0)',
            },
            backgroundColor: 'rgb(51,51,51)',
            backgroundColors: {
                darkModeColor: 'rgb(51,51,51)',
                lightModeColor: 'rgb(255,255,255)',
            },
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });
    });

    it('has default format, light mode', () => {
        const core = createEditorCore(div, {});
        core.lifecycle.value.defaultFormat = {
            bold: true,
            fontFamily: 'arial',
        };
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(0, 0, 0)',
            textColors: undefined,
            backgroundColor: '',
            backgroundColors: undefined,
            bold: true,
            italic: undefined,
            underline: undefined,
        });
    });

    it('has default format, dark mode', () => {
        const core = createEditorCore(div, {});
        core.lifecycle.value.defaultFormat = {
            bold: true,
            fontFamily: 'arial',
        };
        core.lifecycle.value.isDarkMode = true;
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(255,255,255)',
            textColors: { darkModeColor: 'rgb(255,255,255)', lightModeColor: 'rgb(0,0,0)' },
            backgroundColor: 'rgb(51,51,51)',
            backgroundColors: {
                darkModeColor: 'rgb(51,51,51)',
                lightModeColor: 'rgb(255,255,255)',
            },
            bold: true,
            italic: undefined,
            underline: undefined,
        });
    });

    it('has empty default format', () => {
        const core = createEditorCore(div, {});
        core.lifecycle.value.defaultFormat = {};
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({});

        core.lifecycle.value.isDarkMode = true;
        getDefaultFormat(core, true);
        expect(core.lifecycle.value.defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(255,255,255)',
            textColors: { darkModeColor: 'rgb(255,255,255)', lightModeColor: 'rgb(0,0,0)' },
            backgroundColor: 'rgb(51,51,51)',
            backgroundColors: {
                darkModeColor: 'rgb(51,51,51)',
                lightModeColor: 'rgb(255,255,255)',
            },
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });
    });
});
