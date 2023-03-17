import handleLineMerge from '../../lib/plugins/Paste/lineMerge/handleLineMerge';

describe('handleLineMerge', () => {
    function runTest(input: string, expected: string) {
        const div = document.createElement('div');
        div.innerHTML = input;
        handleLineMerge(div);
        expect(div.innerHTML).toBe(expected);
    }

    it('null input', () => {
        handleLineMerge(null);
        expect();
    });

    it('emtpy', () => {
        runTest('', '');
    });

    it('1 line text', () => {
        runTest('test', 'test');
    });

    it('2 line text', () => {
        runTest('te<br>st', 'te<br>st');
    });

    it('3 line text', () => {
        runTest('line1<br>line2<br>line3', 'line1<br>line2<br>line3');
    });

    it('single span', () => {
        runTest('<span>test</span>', '<span>test</span>');
    });

    it('span with br', () => {
        runTest('<span>te<br>st</span>', '<span>te<br>st</span>');
    });

    it('3 line span', () => {
        runTest('<span>line1<br>line2<br>line3</span>', '<span>line1<br>line2<br>line3</span>');
    });

    it('1 div', () => {
        runTest('<div>test</div>', '<span>test</span>');
    });

    it('1 div with style', () => {
        runTest('<div style="color:red">test</div>', '<span style="color:red">test</span>');
    });

    it('div and br', () => {
        runTest('<div>te<br>st</div>', '<div>te<br>st</div>');
    });

    it('br at end of div', () => {
        runTest('<div>line1<br></div>line2', '<span>line1</span><br>line2');
    });

    it('2 div', () => {
        runTest('<div>line1</div><div>line2</div>', '<span>line1</span><br><span>line2</span>');
    });

    it('3 div', () => {
        runTest(
            '<div>line1</div><div>line2</div><div>line3</div>',
            '<span>line1</span><div>line2</div><span>line3</span>'
        );
    });

    it('br outside div', () => {
        runTest(
            '<div>line1</div><br>line2<br>line3<br><div>line4</div>',
            '<span>line1</span><br><br>line2<br>line3<br><span>line4</span>'
        );
    });

    it('1 table cell', () => {
        runTest(
            '<table><tr><td>cell</td></tr></table>',
            '<table><tbody><tr><td>cell</td></tr></tbody></table>'
        );
    });

    it('2 table cells', () => {
        runTest(
            '<table><tr><td>cell1</td><td>cell2</td></tr></table>',
            '<table><tbody><tr><td>cell1</td><td>cell2</td></tr></tbody></table>'
        );
    });

    it('list', () => {
        runTest('<ol><li>line1</li></ol>', '<ol><li>line1</li></ol>');
    });

    it('list and div', () => {
        runTest('<ol><li><div>line1</div></li></ol>', '<ol><li><span>line1</span></li></ol>');
    });

    it('list and 2 div', () => {
        runTest(
            '<ol><li><div>line1</div><div>line2</div></li></ol>',
            '<ol><li><span>line1</span><br><span>line2</span></li></ol>'
        );
    });

    it('2 list items', () => {
        runTest('<ol><li>line1</li><li>line2</li></ol>', '<ol><li>line1</li><li>line2</li></ol>');
    });

    it('nested 1', () => {
        runTest(
            '<div><div>line1</div>line2</div>line3',
            '<div><span>line1</span><br>line2</div>line3'
        );
    });

    it('nested 2', () => {
        runTest(
            'line1<div>line2<div>line3</div></div>',
            'line1<div>line2<br><span>line3</span></div>'
        );
    });

    it('nested 3', () => {
        runTest(
            '<div>line1<div>line2<br>line3</div>line4</div>',
            '<div>line1<div>line2<br>line3</div>line4</div>'
        );
    });

    it('Avoid merge when two pasted lines are going to be merged', () => {
        runTest(
            '<div><span>asdsad</span><span>asdsadsa</span></div><div><span>asdsad</span></div>',
            '<span><span>asdsad</span><span>asdsadsa</span></span><br><span><span>asdsad</span></span>'
        );
    });

    it('Do not had BR when pasting two list items.', () => {
        runTest(
            '<span><ul><li><div><span>asdf</span></div></li><li><span><span>asdf&nbsp;</span></span></li></ul></span>',
            '<span><ul><li><span><span>asdf</span></span></li><li><span><span>asdf&nbsp;</span></span></li></ul></span>'
        );
    });
});
