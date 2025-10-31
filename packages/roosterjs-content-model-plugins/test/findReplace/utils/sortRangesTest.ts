import { sortRanges } from '../../../lib/findReplace/utils/sortRanges';

describe('sortRanges', () => {
    let container: HTMLElement;
    let range1: Range;
    let range2: Range;
    let range3: Range;
    let range4: Range;

    beforeEach(() => {
        container = document.createElement('div');
        container.innerHTML = '<p>First</p><p>Second</p><p>Third</p><p>Fourth</p>';
        document.body.appendChild(container);
        const pElements = container.getElementsByTagName('p');

        range1 = document.createRange();
        range1.setStart(pElements[1].firstChild!, 0);
        range1.setEnd(pElements[1].firstChild!, 6); // "Second"

        range2 = document.createRange();
        range2.setStart(pElements[0].firstChild!, 0);
        range2.setEnd(pElements[0].firstChild!, 5); // "First"
        range3 = document.createRange();
        range3.setStart(pElements[3].firstChild!, 0);
        range3.setEnd(pElements[3].firstChild!, 6); // "Fourth"

        range4 = document.createRange();
        range4.setStart(pElements[2].firstChild!, 0);
        range4.setEnd(pElements[2].firstChild!, 5); // "Third"
    });
    afterEach(() => {
        document.body.removeChild(container);
    });

    it('sorts ranges in document order', () => {
        const ranges = [range1, range2, range3, range4];
        const sortedRanges = sortRanges(ranges);
        expect(sortedRanges).toEqual([range2, range1, range4, range3]);
    });

    it('returns empty array when input is empty', () => {
        const ranges: Range[] = [];
        const sortedRanges = sortRanges(ranges);
        expect(sortedRanges).toEqual([]);
    });

    it('handles ranges with same start container', () => {
        const rangeA = document.createRange();
        rangeA.setStart(container.firstChild!.firstChild!, 0);
        rangeA.setEnd(container.firstChild!.firstChild!, 2); // "Fi"
        const rangeB = document.createRange();
        rangeB.setStart(container.firstChild!.firstChild!, 2);
        rangeB.setEnd(container.firstChild!.firstChild!, 5); // "rst"

        const ranges = [rangeB, rangeA];
        const sortedRanges = sortRanges(ranges);
        expect(sortedRanges).toEqual([rangeA, rangeB]);
    });

    it('handles ranges from different documents', () => {
        const otherDocument = document.implementation.createDocument('', '', null);
        const otherContainer = otherDocument.createElement('div');
        otherContainer.innerHTML = '<p>Other</p>';
        const otherRange = otherDocument.createRange();
        otherRange.setStart(otherContainer.firstChild!.firstChild!, 0);
        otherRange.setEnd(otherContainer.firstChild!.firstChild!, 5); // "Other"
        const ranges = [range1, otherRange, range2];
        const sortedRanges = sortRanges(ranges);

        expect(sortedRanges).toEqual([otherRange, range2, range1]);
    });
});
