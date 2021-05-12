import createRange from '../../lib/selection/createRange';
import getSelectionPath from '../../lib/selection/getSelectionPath';

function dom(domString: string): HTMLElement {
    const parsedResult = new DOMParser().parseFromString(domString, 'text/html').body
        .childNodes[0] as HTMLElement;
    return parsedResult as HTMLElement;
}

describe('getPositionPath', () => {
    describe('When deserializing a selection onto a new DOM that was previously serialized from an old DOM', () => {
        function testSelectionSeralizationIsSame(element: HTMLElement, initialRange: Range) {
            const paths = getSelectionPath(element, initialRange);
            const resultingRange = createRange(element, paths.start, paths.end);
            expect(resultingRange.startContainer).toEqual(initialRange.startContainer);
            expect(resultingRange.startOffset).toEqual(initialRange.startOffset);
            expect(resultingRange.endContainer).toEqual(initialRange.endContainer);
            expect(resultingRange.endOffset).toEqual(initialRange.endOffset);
        }

        it("should be consistent when the serialized selection starts at the beginning of an element's text", () => {
            const div = dom('<div>Characters are selected</div>');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[0], 0);
            initialRange.setEnd(div.childNodes[0], 5);

            expect(getSelectionPath(div, initialRange)).toEqual({
                start: [0, 0],
                end: [0, 5],
            });
            testSelectionSeralizationIsSame(div, initialRange);
        });

        it('should be consistent when  the serialized selection is in a text node that is the only child of its parent', () => {
            const div = dom("<div>ZZZ i'm so selected</div>");
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[0], 1);
            initialRange.setEnd(div.childNodes[0], 3);

            testSelectionSeralizationIsSame(div, initialRange);
        });

        it('should be consistent when the serialized selection is in text node that spans across elements', () => {
            const div = dom('<div>ZZZ <span> selected </span> selected</div>');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[0], 1);
            initialRange.setEnd(div.childNodes[1].childNodes[0], 3);

            testSelectionSeralizationIsSame(div, initialRange);
        });

        it("should be consistent when the serialized selection is an element's full text", () => {
            const div = dom('<div><span>333</span> characters are selected</div>');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[0].childNodes[0], 0);
            initialRange.setEnd(div.childNodes[0].childNodes[0], 3);

            testSelectionSeralizationIsSame(div, initialRange);
        });

        it('should be consistent when the serialized selection spans across multiple elements', () => {
            const div = dom('<div><span>333</span><span>ggg</span><span>fff</span></div>');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[0].childNodes[0], 2);
            initialRange.setEnd(div.childNodes[2].childNodes[0], 2);
            testSelectionSeralizationIsSame(div, initialRange);
        });

        it('should be consistent when the serialized selection is in a text node following an element', () => {
            const div = dom('<div><span>333</span>This is where the selection will be');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[1], 2);
            initialRange.setEnd(div.childNodes[1], 4);
            testSelectionSeralizationIsSame(div, initialRange);
        });

        it('should be consistent when the serialized selection is in a text node following another text node', () => {
            const div = dom('<div><span>333</span>This is where the selection will be');
            div.insertBefore(div.ownerDocument.createTextNode('blahblahblah!'), div.childNodes[1]);
            // Precondition check for text insert
            expect(div.outerHTML).toBe(
                '<div><span>333</span>blahblahblah!This is where the selection will be</div>'
            );
            expect(div.childNodes.length).toBe(3);
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[2], 2);
            initialRange.setEnd(div.childNodes[2], 4);

            // Act
            const paths = getSelectionPath(div, initialRange);
            const divCopy = dom(div.outerHTML);
            const resultingRange = createRange(divCopy, paths.start, paths.end);

            expect(resultingRange.startContainer.textContent).toEqual(
                'blahblahblah!This is where the selection will be'
            );
            expect(resultingRange.startOffset).toEqual(15);
            expect(resultingRange.endContainer.textContent).toEqual(
                'blahblahblah!This is where the selection will be'
            );
            expect(resultingRange.endOffset).toEqual(17);
        });

        it('should be consistent when the serialized selection is in a text node following another text node and spans multiple nodes', () => {
            const div = dom(
                '<div><span>333</span>This is where the selection will be<span>hella</span></div>'
            );
            div.insertBefore(div.ownerDocument.createTextNode('blahblahblah!'), div.childNodes[1]);
            // Precondition check for text insert
            expect(div.outerHTML).toBe(
                '<div><span>333</span>blahblahblah!This is where the selection will be<span>hella</span></div>'
            );
            expect(div.childNodes.length).toBe(4);
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[2], 2);
            initialRange.setEnd(div, 3);

            // Act
            const paths = getSelectionPath(div, initialRange);
            const divCopy = dom(div.outerHTML);
            expect(divCopy.childNodes.length).toBe(3);
            const resultingRange = createRange(divCopy, paths.start, paths.end);

            // Assert
            expect(resultingRange.startContainer.textContent).toEqual(
                'blahblahblah!This is where the selection will be'
            );
            expect(resultingRange.startOffset).toEqual(15);
            expect((resultingRange.endContainer as Element).outerHTML).toEqual(
                '<div><span>333</span>blahblahblah!This is where the selection will be<span>hella</span></div>'
            );
            expect(resultingRange.endOffset).toEqual(2);
        });

        it('Should be able to serialzie an empty dom', () => {
            // Arrange
            const div = dom('<div></div>');

            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div, 0);
            initialRange.setEnd(div, 0);

            // Act
            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [0],
                end: [0],
            });
        });

        it('Should ignore consecutive empty text nodes', () => {
            // Arrange
            const div = dom('<div>This will be split into 3 text nodes</div>');
            (div.childNodes[0] as Text).splitText(5);
            (div.childNodes[0] as Text).splitText(5);
            expect(div.childNodes[0].textContent).toEqual('This ');
            expect(div.childNodes[1].textContent).toEqual('');
            expect(div.childNodes[2].textContent).toEqual('will be split into 3 text nodes');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div.childNodes[2], 5);
            initialRange.setEnd(div.childNodes[2], 5);

            // Act
            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [0, 10],
                end: [0, 10],
            });
        });

        it('Should ignore empty text nodes in between elements', () => {
            // Arrange
            const div = dom('<div><span></span><span></span></div>');
            div.insertBefore(new Text(''), div.childNodes[1]);
            div.insertBefore(new Text(''), div.childNodes[0]);
            const initialRange = div.ownerDocument.createRange();
            expect(div.childNodes[3].nodeName).toEqual('SPAN');
            initialRange.setStart(div, 3);
            initialRange.setEnd(div, 3);

            // Act
            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [1],
                end: [1],
            });
        });

        it('Should not ignore non-empty text nodes when they are followed by empty text elements', () => {
            // Arrange
            const div = dom('<div>Hello<span></span></div>');
            (div.childNodes[0] as Text).splitText(5);
            expect(div.childNodes[0].textContent).toEqual('Hello');
            expect(div.childNodes[1].textContent).toEqual('');
            expect(div.childNodes[1].nodeName).toEqual('#text');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div, 2);
            initialRange.setEnd(div, 2);

            // Act
            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [1],
                end: [1],
            });
        });

        it('Should count multiple mixed non-empty and empty text nodes as one element', () => {
            // Arrange
            const div = dom('<div>Hello<span></span></div>');
            (div.childNodes[0] as Text).splitText(5);
            (div.childNodes[0] as Text).splitText(3);
            (div.childNodes[0] as Text).splitText(3);
            (div.childNodes[0] as Text).splitText(3);
            (div.childNodes[0] as Text).splitText(1);
            (div.childNodes[0] as Text).splitText(1);
            expect(div.childNodes[7].nodeName).toEqual('SPAN');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div, 7);
            initialRange.setEnd(div, 7);

            // Act
            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [1],
                end: [1],
            });
        });

        it('Should ignore empty text nodes around a link', () => {
            // Arrange
            const div = dom(
                '<div><div><a href="http://www.contoso.com">www.contoso.com</a><br></div></div>'
            );
            const a = div.querySelector('a');
            a.parentNode.insertBefore(new Text(''), a);
            a.parentNode.insertBefore(new Text(''), a.nextSibling);
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(a.parentNode, 3);
            initialRange.setEnd(a.parentNode, 3);

            // Act
            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [0, 1],
                end: [0, 1],
            });
        });

        it('Should serialize a selection at the end of an Element node', () => {
            const div = dom('<div><span></span></div>');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div, 1);
            initialRange.setEnd(div, 1);

            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [1],
                end: [1],
            });
        });

        it('Should serialize a selection at the end of an Element node', () => {
            const div = dom('<div><span></span><span></span></div>');
            const initialRange = div.ownerDocument.createRange();
            initialRange.setStart(div, 2);
            initialRange.setEnd(div, 2);

            const paths = getSelectionPath(div, initialRange);

            // Assert
            expect(paths).toEqual({
                start: [2],
                end: [2],
            });
        });
    });
});
