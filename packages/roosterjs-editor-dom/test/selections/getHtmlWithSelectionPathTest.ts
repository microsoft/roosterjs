import getHtmlWithSelectionPath from '../../lib/selection/getHtmlWithSelectionPath';

describe('getHtmlWithSelectionPath', () => {
    it('text content', () => {
        const div = document.createElement('div');
        const range = document.createRange();
        div.innerHTML = 'test';
        range.setStart(div.firstChild, 2);
        range.setEnd(div.firstChild, 2);
        const html = getHtmlWithSelectionPath(div, range);
        expect(html).toBe('test<!--{"start":[0,2],"end":[0,2]}-->');
    });

    it('DIV and SPAN content', () => {
        const div = document.createElement('div');
        const range = document.createRange();
        div.innerHTML = 'test1<div>text 2<span>test3</span>test 4</div>test 5';
        range.setStart(div.childNodes[1].childNodes[0], 2);
        range.setEnd(div.childNodes[2], 3);
        const html = getHtmlWithSelectionPath(div, range);
        expect(html).toBe(
            'test1<div>text 2<span>test3</span>test 4</div>test 5<!--{"start":[1,0,2],"end":[2,3]}-->'
        );
    });
});
