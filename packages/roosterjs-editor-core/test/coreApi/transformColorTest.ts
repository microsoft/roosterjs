import createEditorCore from './createMockEditorCore';
import { ColorTransformDirection } from 'roosterjs-editor-types';
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
        transformColor(core, null, ColorTransformDirection.DarkToLight);
        expect();
    });

    it('no dataset, no style, no attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('no dataset, no style, has attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('no dataset, has style, no attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.style.color = 'red';
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style=""></div>');
    });

    it('has dataset, no style, no attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, has style, no attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.style.color = 'black';
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, no style, has attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.setAttribute('color', 'black');
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, has style, has attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.setAttribute('color', 'black');
        element.style.color = 'green';
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset for ogsc and ogac, has style, has attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.dataset.ogac = 'yellow';
        element.setAttribute('color', 'black');
        element.style.color = 'green';
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div color="yellow" style="color: red;"></div>');
    });

    it('has dataset for ogsc, ogac, ogsb, ogab, has style, has attr', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.dataset.ogac = 'yellow';
        element.dataset.ogsb = 'blue';
        element.dataset.ogab = 'gray';
        element.setAttribute('color', 'black');
        element.setAttribute('bgcolor', '#012345');
        element.style.color = 'green';
        element.style.backgroundColor = '#654321';
        transformColor(core, [element], ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe(
            '<div color="yellow" bgcolor="gray" style="color: red; background-color: blue;"></div>'
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
        const core = createEditorCore(div, {});
        transformColor(core, null, ColorTransformDirection.LightToDark);
        expect();
    });

    it('empty array', () => {
        const core = createEditorCore(div, {});
        transformColor(core, [], ColorTransformDirection.LightToDark);
        expect();
    });

    it('array has null element', () => {
        const core = createEditorCore(div, {});
        transformColor(core, [null], ColorTransformDirection.LightToDark);
        expect();
    });

    it('single element, no transform function', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        transformColor(core, [element], ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('single element with color and background color, no transform function', () => {
        const core = createEditorCore(div, {});
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        transformColor(core, [element], ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe('<div style=""></div>');
    });

    it('single element with color and background color, has transform function', () => {
        const core = createEditorCore(div, {
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
        transformColor(core, [element], ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: white; background-color: black;" data-ogsc="red" data-ogsb="green"></div>'
        );
    });
});
