import changeElementTag from '../../utils/changeElementTag';

describe('changeElementTag()', () => {
    function runTest(caseIndex: number, input: string, newTag: string, result: string) {
        let index = `case index ${caseIndex}`;
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = div.firstChild as HTMLElement;
        node = changeElementTag(node, newTag);
        expect(div.innerHTML).toBe(result, index);
        expect(node.outerHTML).toBe(result, index);
        document.body.removeChild(div);
    }

    it('changeElementTag()', () => {
        runTest(0, '<div></div>', 'DIV', '<div></div>');
        runTest(1, '<div></div>', 'A', '<a></a>');
        runTest(2, '<div></div>', 'SPAN', '<span></span>');
        runTest(3, '<div></div>', 'P', '<p style="margin-top: 0px; margin-bottom: 0px;"></p>');
        runTest(4, '<div id="div1"></div>', 'SPAN', '<span id="div1"></span>');
        runTest(
            5,
            '<div id="div1" style="color: red"></div>',
            'SPAN',
            '<span id="div1" style="color: red"></span>'
        );
        runTest(
            6,
            '<div id="div1" style="color: red"><span>test1</span><span>test2</span></div>',
            'SPAN',
            '<span id="div1" style="color: red"><span>test1</span><span>test2</span></span>'
        );
        runTest(7, '<p></p>', 'DIV', '<div style="margin-top: 16px; margin-bottom: 16px;"></div>');
        runTest(
            8,
            '<p style="margin-top: 2px"></p>',
            'DIV',
            '<div style="margin-top: 2px; margin-bottom: 16px;"></div>'
        );
        runTest(
            9,
            '<div style="margin: 0 2px 2px 0"></div>',
            'P',
            '<p style="margin: 0 2px 2px 0"></p>'
        );
    });
});
