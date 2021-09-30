import getInnerHTML from '../../lib/utils/getInnerHTML';

describe('getInnerHTML', () => {
    it('Null input', () => {
        const html = getInnerHTML(null);
        expect(html).toBe('');
    });

    it('HTMLElement', () => {
        const test = 'test<div>test1</div><!--test2-->test3';
        const element = document.createElement('div');
        element.innerHTML = test;
        const html = getInnerHTML(element);
        expect(html).toBe(test);
    });

    it('DocumentFragment', () => {
        const test = 'test<div>test1</div><!--test2-->test3';
        const element = document.createElement('div');
        element.innerHTML = test;
        const fragment = document.createDocumentFragment();
        fragment.appendChild(element);
        const html = getInnerHTML(fragment);
        expect(html).toBe('<div>' + test + '</div>');
        expect(element.parentNode).toBe(fragment);
    });
});
