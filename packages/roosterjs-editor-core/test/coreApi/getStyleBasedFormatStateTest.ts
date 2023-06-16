import createEditorCore from './createMockEditorCore';
import { DarkColorHandler } from 'roosterjs-editor-types';
import { getStyleBasedFormatState } from '../../lib/coreApi/getStyleBasedFormatState';

describe('getStyleBasedFormatState', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('light mode', () => {
        const core = createEditorCore(div, {});
        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('black');
        expect(style.backgroundColor).toBe('white');
        expect(style.textColors).toBeUndefined();
        expect(style.backgroundColors).toBeUndefined();
    });

    it('dark mode, no color node', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('black');
        expect(style.backgroundColor).toBe('white');
        expect(style.textColors).toBeUndefined();
        expect(style.backgroundColors).toBeUndefined();
    });
});

describe('getStyleBasedFormatState with var based color', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('light mode', () => {
        const core = createEditorCore(div, {});

        core.darkColorHandler = ({
            parseColorValue: (color: string) => ({
                lightModeColor: color == 'black' ? 'green' : color == 'white' ? 'yellow' : 'brown',
                darkModeColor: color == 'black' ? 'blue' : color == 'white' ? 'red' : 'gray',
            }),
        } as any) as DarkColorHandler;

        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('green');
        expect(style.backgroundColor).toBe('yellow');
        expect(style.textColors).toEqual({
            lightModeColor: 'green',
            darkModeColor: 'blue',
        });
        expect(style.backgroundColors).toEqual({
            lightModeColor: 'yellow',
            darkModeColor: 'red',
        });
    });

    it('dark mode, no color node', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        core.darkColorHandler = ({
            parseColorValue: (color: string) => ({
                lightModeColor: color == 'black' ? 'green' : color == 'white' ? 'yellow' : 'brown',
                darkModeColor: color == 'black' ? 'blue' : color == 'white' ? 'red' : 'gray',
            }),
        } as any) as DarkColorHandler;

        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('green');
        expect(style.backgroundColor).toBe('yellow');
        expect(style.textColors).toEqual({
            lightModeColor: 'green',
            darkModeColor: 'blue',
        });
        expect(style.backgroundColors).toEqual({
            lightModeColor: 'yellow',
            darkModeColor: 'red',
        });
    });

    it('dark mode, no color', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt;"><div id="div1">test</div></div>';
        const node = document.getElementById('div1');
        const style = getStyleBasedFormatState(core, node);
        expect(style.fontName).toBe('arial');
        expect(style.fontSize).toBe('12pt');
        expect(style.textColor).toBe('');
        expect(style.backgroundColor).toBe('');
        expect(style.textColors).toBeUndefined();
        expect(style.backgroundColors).toBeUndefined();
    });
});
