import {markSelection as markSelectionSpan, removeMarker as removeMarkerSpan} from '../../selection/selectionMarker';
import {markSelection as markSelectionContainerAttributes, removeMarker as removeMarkerContainerAttributes} from '../../selection/experimentalAttributeBasedSelectionMarker';

function dom(domString: string): HTMLElement {
    const parsedResult = new DOMParser().parseFromString(domString, "text/html").body.childNodes[0];
    return parsedResult as HTMLElement;
}

/**
 * Helper to test a case agaisnt both markSelection APIs.
 */
function testMarkSelectionIsNonDestructive(message: string, getTestData: () => [HTMLElement, Range]) {
    describe(message, () => {
        it('For a Reflowing Selection', () => {
            const [container, initialRange] = getTestData();
            test(
                markSelectionSpan,
                removeMarkerSpan,
                container,
                initialRange
            );
        });

        it('For a Non-Reflowing Selection', () => {
            const [container, initialRange] = getTestData();
            test(
                markSelectionContainerAttributes,
                removeMarkerContainerAttributes,
                container,
                initialRange
            );
        });
    });
}

function test(
        markSelection: (contianer: HTMLElement, range: Range, useInlineMarker: boolean) => void,
        removeMarker: (container: HTMLElement, retrieveSelectioNRange: boolean) => Range,
        element: HTMLElement,
        initialRange: Range
    ) {

    const parentElement = element.parentElement;
    markSelection(parentElement, initialRange, true);
    const resultingRange = removeMarker(parentElement, true);

    expect(resultingRange.startContainer).toEqual(initialRange.startContainer, "start containers should match");
    expect(resultingRange.startOffset).toEqual(initialRange.startOffset, "start offsets should match");
    expect(resultingRange.endContainer).toEqual(initialRange.endContainer, "end containers should match");
    expect(resultingRange.endOffset).toEqual(initialRange.endOffset, "ending offsets should match");
}


describe('markSelection()', () => {

    describe('When deserializing a selection that was previously serialized, it should be consistent', () => {
        testMarkSelectionIsNonDestructive('should be consistent when the serialized selection starts at the beginning of an element\'s text', () => {
            const div = dom('<div>Characters are selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0], 0);
            initialRange.setEnd(div.childNodes[0], 5);
            return [div, initialRange];
        });

        testMarkSelectionIsNonDestructive('should be consistent when  the serialized selection is in a text node that is the only child of its parent', () => {
            const div = dom('<div>ZZZ i\'m so selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0], 1);
            initialRange.setEnd(div.childNodes[0], 3);
            return [div, initialRange];
        });

        testMarkSelectionIsNonDestructive('should be consistent when the serialized selection is in text node that spans across elements', () => {
            const div = dom('<div>ZZZ <span> selected </span> selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0], 1);
            initialRange.setEnd(div.childNodes[1].childNodes[0], 3);

            return [div, initialRange];
        });

        testMarkSelectionIsNonDestructive('should be consistent when the serialized selection is an element\'s full text', () => {
            const div = dom('<div><span>333</span> characters are selected</div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0].childNodes[0], 0);
            initialRange.setEnd(div.childNodes[0].childNodes[0], 3);

            return [div, initialRange];
        });

        testMarkSelectionIsNonDestructive('should be consistent when the serialized selection spans across multiple elements', () => {
            const div = dom('<div><span>333</span><span>ggg</span><span>fff</span></div>');
            const initialRange = new Range()
            initialRange.setStart(div.childNodes[0].childNodes[0], 2);
            initialRange.setEnd(div.childNodes[2].childNodes[0], 2);
            return [div, initialRange];
        })
    })
});