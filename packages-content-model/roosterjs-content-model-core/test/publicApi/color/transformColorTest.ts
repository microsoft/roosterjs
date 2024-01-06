import { createSnapshotsManager } from '../../../lib/editor/SnapshotsManagerImpl';
import { transformColor } from '../../../lib/publicApi/color/transformColor';

describe('transform to dark mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(element: HTMLElement, expectedHtml: string) {
        const snapshots = createSnapshotsManager(div, color => {
            return color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '';
        });

        transformColor(element, true, 'lightToDark', snapshots);

        expect(element.outerHTML).toBe(expectedHtml);
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>');
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';

        runTest(element, '<div style="color: blue; background-color: yellow;"></div>');
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(element, '<div style="color: blue; background-color: yellow;"></div>');
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(element, '<div style="color: blue; background-color: yellow;"></div>');
    });
});

describe('transform to light mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(element: HTMLElement, expectedHtml: string) {
        const snapshots = createSnapshotsManager(div, color => {
            return color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '';
        });

        transformColor(element, true /*includeSelf*/, 'darkToLight', snapshots);

        expect(element.outerHTML).toBe(expectedHtml);
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>');
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';

        runTest(element, '<div style="color: blue; background-color: yellow;"></div>');
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(element, '<div style="color: blue; background-color: yellow;"></div>');
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(element, '<div style="color: blue; background-color: yellow;"></div>');
    });
});
