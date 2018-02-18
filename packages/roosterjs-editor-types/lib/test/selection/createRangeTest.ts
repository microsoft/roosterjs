import SelectionRangeBase from '../../selection/SelectionRange';
import Position from '../../selection/Position';

function runTest(
    start: Position,
    end: Position,
    expectStart: Position,
    expectEnd: Position,
    expectCollapsed: boolean
) {
    let range = SelectionRangeBase.create(start, end);
    expect(range.start).toEqual(expectStart);
    expect(range.end).toEqual(expectEnd);
    expect(range.collapsed).toBe(expectCollapsed);
}

describe('SelectionRangeBase.create test', () => {
    it('SelectionRangeBase.create', () => {
        let node1 = <Node>(<any>{});
        let node2 = <Node>(<any>{});
        let start1 = {
            node: node1,
            offset: 0,
            isAtEnd: false,
        };
        let end1 = {
            node: node1,
            offset: 0,
            isAtEnd: false,
        };
        let end2 = {
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
