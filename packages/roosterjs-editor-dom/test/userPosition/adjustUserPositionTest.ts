import { NodePosition, PositionType } from 'roosterjs-editor-types';
import {
    Position,
    adjustInsertPositionForHyperLink,
    adjustInsertPositionForParagraph,
    adjustInsertPositionForStructuredNode,
    adjustInsertPositionForVoidElement,
} from 'roosterjs-editor-dom';

describe('adjustInsertPositionForHyperLink', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let range: Range;
    it('non existent block of element', () => {
        range = document.createRange();
        root = document.createElement('div');
        nodeToInsert = document.createElement('img');
        position = Position.getStart(range);
        const result = adjustInsertPositionForHyperLink(root, nodeToInsert, position, range);
        expect(result).toEqual(position);
    });
});

describe('adjustInsertPositionForStructuredNode', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let range: Range;
    it('div position', () => {
        range = document.createRange();
        root = document.createElement('div');
        nodeToInsert = document.createElement('img');
        position = Position.getStart(range);
        const result = adjustInsertPositionForStructuredNode(root, nodeToInsert, position, range);
        expect(result).toBe(position);
    });
});

describe('adjustInsertPositionForParagraph', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let range: Range;
    it('div position', () => {
        range = document.createRange();
        root = document.createElement('div');
        nodeToInsert = document.createElement('img');
        position = Position.getStart(range);
        const result = adjustInsertPositionForParagraph(root, nodeToInsert, position, range);
        expect(result).toBe(position);
    });
});

describe('adjustInsertPositionForVoidElement', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let range: Range;
    it('br position', () => {
        root = document.createElement('br');
        position = new Position(root, 1);
        const newPosition = new Position(
            position.node,
            position.isAtEnd ? PositionType.After : PositionType.Before
        );
        const result = adjustInsertPositionForVoidElement(root, nodeToInsert, position, range);
        expect(result).toEqual(newPosition);
    });

    it('div position', () => {
        root = document.createElement('div');
        position = new Position(root, 1);
        const result = adjustInsertPositionForVoidElement(root, nodeToInsert, position, range);
        expect(result).toEqual(position);
    });
});
