import {markSelection, removeMarker} from '../../selection/experimentalAttributeBasedSelectionMarker';

function dom(domString: string): HTMLElement {
    const parsedResult = new DOMParser().parseFromString(domString, "text/html").body.childNodes[0];
    return parsedResult as HTMLElement;
}

fdescribe('markSelection()', () => {

    describe('When deserializing a selection that was previously serialized, it should be consistent', () => {

        function testSelectionIsNondestructive(element: HTMLElement, initialRange: Range) {
            const parentElement = element.parentElement;
            markSelection(parentElement, initialRange, true);
            const resultingRange = removeMarker(parentElement, true);

            expect(resultingRange.startContainer).toEqual(initialRange.startContainer, "start containers should match");
            expect(resultingRange.startOffset).toEqual(initialRange.startOffset, "start offsets should match");
            expect(resultingRange.endContainer).toEqual(initialRange.endContainer, "end containers should match");
            expect(resultingRange.endOffset).toEqual(initialRange.endOffset, "ending offsets should match");
        }

        it('should be consistent when the serialized selection starts at the beginning of an element\'s text', () => {
            const div = dom('<div>Characters are selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0], 0);
            initialRange.setEnd(div.childNodes[0], 5);

            testSelectionIsNondestructive(div, initialRange);
        });

        it('should be consistent when  the serialized selection is in a text node that is the only child of its parent', () => {
            const div = dom('<div>ZZZ i\'m so selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0], 1);
            initialRange.setEnd(div.childNodes[0], 3);

            testSelectionIsNondestructive(div, initialRange);
        });

        it('should be consistent when the serialized selection is in text node that spans across elements', () => {
            const div = dom('<div>ZZZ <span> selected </span> selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0], 1);
            initialRange.setEnd(div.childNodes[1].childNodes[0], 3);

            testSelectionIsNondestructive(div, initialRange);
        });

        it('should be consistent when the serialized selection is an element\'s full text', () => {
            const div = dom('<div><span>333</span> characters are selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0].childNodes[0], 0);
            initialRange.setEnd(div.childNodes[0].childNodes[0], 3);

            testSelectionIsNondestructive(div, initialRange);
        });

        it('should be consistent when the serialized selection spans across multiple elements', () => {
            const div = dom('<div><span>333</span><span>ggg</span><span>fff</span></div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0].childNodes[0], 2);
            initialRange.setEnd(div.childNodes[2].childNodes[0], 2);
            testSelectionIsNondestructive(div, initialRange);
        })
    })
});