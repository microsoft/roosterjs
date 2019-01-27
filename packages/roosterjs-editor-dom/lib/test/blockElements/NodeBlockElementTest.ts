import * as DomTestHelper from '../DomTestHelper';
import NodeBlockElement from '../../blockElements/NodeBlockElement';

let testID = 'NodeBlockElement';

function createNodeBlockElementWithContent(content: string): [NodeBlockElement, HTMLElement] {
    let testDiv = DomTestHelper.createElementFromContent(testID, content);
    let nodeBlockElement = new NodeBlockElement(testDiv);
    return [nodeBlockElement, testDiv];
}

describe('NodeBlockElement getStartNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>www.example.com</span>'
        );

        // Act
        let startNode = nodeBlockElement.getStartNode();

        // Assert
        expect(startNode).toBe(testDiv);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>part1</span><span>part2</span>'
        );

        // Act
        let startNode = nodeBlockElement.getStartNode();

        // Assert
        expect(startNode).toBe(testDiv);
    });
});

describe('NodeBlockElement getEndNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>www.example.com</span>'
        );

        // Act
        let endNode = nodeBlockElement.getEndNode();

        // Assert
        expect(endNode).toBe(testDiv);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>part1</span><span>part2</span>'
        );

        // Act
        let endNode = nodeBlockElement.getEndNode();

        // Assert
        expect(endNode).toBe(testDiv);
    });
});

describe('NodeBlockElement equals()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('nodeBlockElement1 equals nodeBlockElement2', () => {
        // Arrange
        let [nodeBlockElement1, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let nodeBlockElement2 = DomTestHelper.createNodeBlockElementWithDiv(testDiv);

        // Act
        let isEqual = nodeBlockElement1.equals(nodeBlockElement2);

        // Assert
        expect(isEqual).toBe(true);
    });

    it('nodeBlockElement1 does not equal nodeBlockElement2', () => {
        // Arrange
        let [nodeBlockElement1, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let nodeBlockElement2 = DomTestHelper.createNodeBlockElementWithDiv(
            testDiv.firstChild as HTMLElement
        );

        // Act
        let isEqual = nodeBlockElement1.equals(nodeBlockElement2);

        // Assert
        expect(isEqual).toBe(false);
    });
});

describe('NodeBlockElement isAfter()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: [Node, Node], output: [boolean, boolean]) {
        // Arrange
        let nodeBlockElement1 = DomTestHelper.createNodeBlockElementWithDiv(
            input[0] as HTMLElement
        );
        let nodeBlockElement2 = DomTestHelper.createNodeBlockElementWithDiv(
            input[1] as HTMLElement
        );

        // Act
        let isElement2AfterElement1 = nodeBlockElement2.isAfter(nodeBlockElement1);
        let isElement1AfterElement2 = nodeBlockElement1.isAfter(nodeBlockElement2);

        // Assert
        expect(isElement2AfterElement1).toBe(output[0]);
        expect(isElement1AfterElement2).toBe(output[1]);
    }

    it('input = <div>part1</div><div>part2</div>, nodeBlockElement2 is after nodeBlockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<div>part1</div><div>part2</div>'
        );
        runTest([testDiv.firstChild, testDiv.lastChild], [true, false]);
    });

    it('input = <div>part1<div>part2</div></div>, nodeBlockElement2 is after nodeBlockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<div>part1<div>part2</div></div>'
        );
        runTest([testDiv.firstChild.firstChild, testDiv.firstChild.lastChild], [true, false]);
    });

    it('input = <div>www.example.com</div>, nodeBlockElement1 equals to nodeBlockElement2', () => {
        let testDiv = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest([testDiv, testDiv], [false, false]);
    });
});

describe('NodeBlockElement contains()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('nodeBlockElement contains node', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let containedNode = testDiv.firstChild;

        // Act
        let nodeBlockElementContainsNode = nodeBlockElement.contains(containedNode);

        // Assert
        expect(nodeBlockElementContainsNode).toBe(true);
    });

    it('nodeBlockElement.node equals node', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let containedNode = testDiv;

        // Act
        let nodeBlockElementContainsNode = nodeBlockElement.contains(containedNode);

        // Assert
        expect(nodeBlockElementContainsNode).toBe(true);
    });

    it('nodeBlockElement does not contain node', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<div>part1</div><div>part2</div>'
        );
        let nodeBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            testDiv.firstChild as HTMLElement
        );
        let containedNode = testDiv.lastChild;

        // Act
        let nodeBlockElementContainsNode = nodeBlockElement.contains(containedNode);

        // Assert
        expect(nodeBlockElementContainsNode).toBe(false);
    });
});
