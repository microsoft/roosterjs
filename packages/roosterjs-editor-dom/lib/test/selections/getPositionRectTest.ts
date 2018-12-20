import getPositionRect from '../../selection/getPositionRect';
import Position from '../../selection/Position';

describe('getPositionRect()', () => {
    function runTest(
        input: string,
        getNode: () => Node,
        offset: number,
        expectLeft: number,
        expectRight: number,
        expectTop: number,
        expectBottom: number
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.style.position = 'absolute';
        div.style.left = '10px';
        div.style.top = '10px';
        div.style.fontSize = '20px';
        div.style.fontFamily = 'Arial';
        div.innerHTML = input;
        let node = getNode();
        let position = node && new Position(node, offset);
        let rect = getPositionRect(position);
        if (rect) {
            let { left, right, top, bottom } = rect;
            expect(left).toBeGreaterThanOrEqual(expectLeft - 1, 'left');
            expect(right).toBeGreaterThanOrEqual(expectRight - 1, 'right');
            expect(top).toBeGreaterThanOrEqual(expectTop - 1, 'top');
            expect(bottom).toBeGreaterThanOrEqual(expectBottom - 1, 'bottom');
            expect(left).toBeLessThanOrEqual(expectLeft + 1, 'left');
            expect(right).toBeLessThanOrEqual(expectRight + 1, 'right');
            expect(top).toBeLessThanOrEqual(expectTop + 1, 'top');
            expect(bottom).toBeLessThanOrEqual(expectBottom + 1, 'bottom');
        } else {
            expect(expectLeft + expectRight + expectTop + expectBottom).toBe(0, 'Rect');
        }
        document.body.removeChild(div);
    }

    it('Null', () => {
        runTest('', () => null, 0, 0, 0, 0, 0);
    });

    it('Beginning of line', () => {
        runTest('<div id=id1>test1</div>', () => $('id1'), 0, 10, 10, 10, 32);
    });

    it('End of line', () => {
        runTest('<div id=id1>test<br></div>', () => $('id1'), 1, 42, 42, 10, 32);
    });

    it('Between elements', () => {
        runTest(
            '<div id=id1><span>test1</span><span>test2</span></div>',
            () => $('id1'),
            1,
            53,
            53,
            10,
            32
        );
    });

    it('In text', () => {
        runTest('<div id=id1>test1</div>', () => $('id1').firstChild, 2, 27, 27, 10, 32);
    });

    it('In long text', () => {
        runTest(
            '<div id=id1 style="width:100px">test1 test1 test1 test1 test1 test1 test1</div>',
            () => $('id1').firstChild,
            25,
            16,
            16,
            56,
            78
        );
    });

    it('Between empty elements', () => {
        runTest(
            '<div id=id1 style="width:100px">test1<img style="width: 20px; height: 20px"><img style="width: 20px; height: 20px"></div>',
            () => $('id1'),
            2,
            73,
            93,
            10,
            30
        );
    });
});

function $(id: string) {
    return document.getElementById(id);
}
