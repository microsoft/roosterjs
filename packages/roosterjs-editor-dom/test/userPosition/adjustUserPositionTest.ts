import { EditorCore, NodePosition, PositionType } from 'roosterjs-editor-types/lib';
import { Position } from 'roosterjs-editor-dom/lib';
import {
    adjustInsertPositionForHyperLink,
    adjustInsertPositionForParagraph,
    adjustInsertPositionForStructuredNode,
    adjustInsertPositionForVoidElement,
} from 'roosterjs-editor-dom/lib/userPosition/adjustUserPosition';

describe('adjustInsertPositionForHyperLink', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let editor: EditorCore;
    it('non existent block of element', () => {
        const range = document.createRange();
        root = document.createElement('div');
        nodeToInsert = document.createElement('img');
        position = Position.getStart(range);
        const result = adjustInsertPositionForHyperLink(root, nodeToInsert, position, editor);
        expect(result).toEqual(position);
    });
});

describe('adjustInsertPositionForStructuredNode', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let editor: EditorCore;
    it('div position', () => {
        const range = document.createRange();
        root = document.createElement('div');
        nodeToInsert = document.createElement('img');
        position = Position.getStart(range);
        const result = adjustInsertPositionForStructuredNode(root, nodeToInsert, position, editor);
        expect(result).toBe(position);
    });
});

describe('adjustInsertPositionForParagraph', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let editor: EditorCore;
    it('div position', () => {
        const range = document.createRange();
        root = document.createElement('div');
        nodeToInsert = document.createElement('img');
        position = Position.getStart(range);
        const result = adjustInsertPositionForParagraph(root, nodeToInsert, position, editor);
        expect(result).toBe(position);
    });
});

describe('adjustInsertPositionForVoidElement', () => {
    let root: HTMLElement;
    let nodeToInsert: Node;
    let position: NodePosition;
    let editor: EditorCore;
    it('br position', () => {
        root = document.createElement('br');
        position = new Position(root, 1);
        const newPosition = new Position(
            position.node,
            position.isAtEnd ? PositionType.After : PositionType.Before
        );
        const result = adjustInsertPositionForVoidElement(root, nodeToInsert, position, editor);
        expect(result).toEqual(newPosition);
    });

    it('div position', () => {
        root = document.createElement('div');
        position = new Position(root, 1);
        const result = adjustInsertPositionForVoidElement(root, nodeToInsert, position, editor);
        expect(result).toEqual(position);
    });
});
