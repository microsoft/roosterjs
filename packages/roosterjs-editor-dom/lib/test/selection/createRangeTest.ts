import SelectionRange from '../../selection/SelectionRange';
import Position from '../../selection/Position';

function runTest(
    start: Position,
    end: Position,
    expectStart: Position,
    expectEnd: Position,
    expectCollapsed: boolean
) {
    let range = new SelectionRange(start, end);
    expect(range.start).toEqual(expectStart);
    expect(range.end).toEqual(expectEnd);
    expect(range.collapsed).toBe(expectCollapsed);
}

describe('new SelectionRange test', () => {
    it('new SelectionRange', () => {
        let node1 = <Node>(<any>{});
        let node2 = <Node>(<any>{});
        let start1 = <Position>{
            node: node1,
            offset: 0,
            isAtEnd: false,
        };
        let end1 = <Position>{
            node: node1,
            offset: 0,
            isAtEnd: false,
        };
        let end2 = <Position>{
            node: node2,
            offset: 1,
            isAtEnd: false,
        };
        runTest(start1, start1, start1, start1, true);
        runTest(start1, end1, start1, end1, true);
        runTest(start1, end2, start1, end2, false);
        runTest(start1, null, start1, start1, true);
    });
});
