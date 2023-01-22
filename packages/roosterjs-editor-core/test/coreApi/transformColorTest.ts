import createEditorCore from './createMockEditorCore';
import { ColorTransformDirection } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { transformColor } from '../../lib/coreApi/transformColor';

describe('transformColor Dark to light', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, {});
        transformColor(core, null, true, null, ColorTransformDirection.DarkToLight);
        expect();
    });

    it('callback must be called', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const callback = jasmine.createSpy('callback');
        transformColor(core, null, true, callback, ColorTransformDirection.DarkToLight);
        expect(callback).toHaveBeenCalled();
    });

    it('no dataset, no style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('no dataset, no style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div color="red"></div>');
    });

    it('no dataset, has style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.style.color = 'red';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>'); // TODO
    });
});

describe('transformColor Light to dark', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        transformColor(core, null, true, null, ColorTransformDirection.LightToDark);
        expect();
    });

    it('light mode, no need to transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.style.color = 'rgb(18, 52, 86)';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe('<div style="color: rgb(18, 52, 86);"></div>');
    });

    it('light mode still need to transform when force transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.style.color = 'rgb(18, 52, 86)';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark, true);
        expect(element.outerHTML).toBe(
            '<div style="color: var(--darkColor_rgb_18__52__86_,rgb(18, 52, 86));"></div>'
        );
    });

    it('single element, no transform function', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('single element with color and background color, no transform function', () => {
        const core = createEditorCore(div, { inDarkMode: true, getDarkColor });
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: var(--darkColor_red,red); background-color: var(--darkColor_green,green);"></div>'
        );
    });

    it('single element with inherit color', () => {
        const core = createEditorCore(div, { inDarkMode: true, getDarkColor });
        const element = document.createElement('div');
        element.style.color = 'inherit';
        element.style.backgroundColor = 'inherit';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: inherit; background-color: inherit;"></div>'
        );
    });
});
