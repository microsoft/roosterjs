import { removeUnnecessarySpan } from '../../../lib/modelToDom/optimizers/removeUnnecessarySpan';

describe('removeUnnecessarySpan', () => {
    it('Empty node', () => {
        const div = document.createElement('div');

        removeUnnecessarySpan(div);

        expect(div.innerHTML).toBe('');
    });

    it('Node with non-SPAN child', () => {
        const div = document.createElement('div');
        div.appendChild(document.createElement('b'));

        removeUnnecessarySpan(div);

        expect(div.innerHTML).toBe('<b></b>');
    });

    it('Node with empty SPAN', () => {
        const div = document.createElement('div');
        div.appendChild(document.createElement('span'));

        removeUnnecessarySpan(div);

        expect(div.innerHTML).toBe('');
    });

    it('Node with SPAN that has child', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span>test</span>';

        removeUnnecessarySpan(div);

        expect(div.innerHTML).toBe('test');
    });

    it('Node with SPAN that has attribute', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span id="a">test</span>';

        removeUnnecessarySpan(div);

        expect(div.innerHTML).toBe('<span id="a">test</span>');
    });

    it('Node with multiple children', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span>test1</span><span id="a">test2</span><b>test3</b>';

        removeUnnecessarySpan(div);

        expect(div.innerHTML).toBe('test1<span id="a">test2</span><b>test3</b>');
    });
});
