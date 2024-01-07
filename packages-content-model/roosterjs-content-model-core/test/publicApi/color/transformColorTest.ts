import { createSnapshotsManager } from '../../../lib/editor/SnapshotsManagerImpl';
import { transformColor } from '../../../lib/publicApi/color/transformColor';

describe('transform to dark mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(element: HTMLElement, expectedHtml: string, expectedContainerHtml: string) {
        const snapshots = createSnapshotsManager(div, color => {
            return color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '';
        });

        transformColor(element, true, 'lightToDark', snapshots);

        expect(element.outerHTML).toBe(expectedHtml, 'element html');
        expect(div.outerHTML).toBe(expectedContainerHtml, 'container html');
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>', '<div></div>');
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';

        runTest(
            element,
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(
            element,
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(
            element,
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });
});

describe('transform to light mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(element: HTMLElement, expectedHtml: string, expectedContainerHtml: string) {
        const snapshots = createSnapshotsManager(div, color => color, {
            knownColors: {
                red: {
                    lightColor: '#0000ff',
                    darkColor: '#ff0000',
                },
                green: {
                    lightColor: '#ffff00',
                    darkColor: '#00ff00',
                },
            },
        } as any);

        transformColor(element, true /*includeSelf*/, 'darkToLight', snapshots);

        expect(element.outerHTML).toBe(expectedHtml, 'element html');
        expect(div.outerHTML).toBe(expectedContainerHtml, 'container html');
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>', '<div></div>');
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = '#ff0000';
        element.style.backgroundColor = '#00ff00';

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', '#ff0000');
        element.setAttribute('bgcolor', '#00ff00');

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = '#ff0000';
        element.style.backgroundColor = '#00ff00';
        element.setAttribute('color', '#888888');
        element.setAttribute('bgcolor', '#444444');

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0);"></div>',
            '<div></div>'
        );
    });
});
