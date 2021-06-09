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

    it('light mode, no need to transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.dataset.ogsc = '#123456';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div data-ogsc="#123456"></div>');
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
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('no dataset, has style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.style.color = 'red';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style=""></div>');
    });

    it('has dataset, no style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, has style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.style.color = 'black';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, no style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.setAttribute('color', 'black');
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, has style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.setAttribute('color', 'black');
        element.style.color = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset for ogsc and ogac, has style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.dataset.ogac = 'yellow';
        element.setAttribute('color', 'black');
        element.style.color = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div color="yellow" style="color: red;"></div>');
    });

    it('has dataset for ogsc, ogac, ogsb, ogab, has style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.dataset.ogac = 'yellow';
        element.dataset.ogsb = 'blue';
        element.dataset.ogab = 'gray';
        element.setAttribute('color', 'black');
        element.setAttribute('bgcolor', '#012345');
        element.style.color = 'green';
        element.style.backgroundColor = '#654321';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe(
            '<div color="yellow" bgcolor="gray" style="color: red; background-color: blue;"></div>'
        );
    });

    it('do not include self', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        const child = document.createElement('div');
        child.dataset.ogsc = 'green';
        element.appendChild(child);
        transformColor(core, element, false, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe(
            '<div data-ogsc="red"><div style="color: green;"></div></div>'
        );
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
            '<div style="color: rgb(255, 39, 17) !important; background-color: rgb(74, 175, 57) !important;" data-ogsc="red" data-ogsb="green"></div>'
        );
    });

    it('single element with color and background color, has transform function', () => {
        const core = createEditorCore(div, {
            inDarkMode: true,
            onExternalContentTransform: element => {
                element.dataset.ogsc = element.style.color;
                element.dataset.ogsb = element.style.backgroundColor;
                element.style.color = 'white';
                element.style.backgroundColor = 'black';
            },
        });
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: white; background-color: black;" data-ogsc="red" data-ogsb="green"></div>'
        );
    });
});
