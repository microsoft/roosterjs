import { mergeNode } from '../../../lib/modelToDom/optimizers/mergeNode';

describe('mergeNode', () => {
    it('Empty node', () => {
        const node = document.createElement('div');
        mergeNode(node);
        expect(node.innerHTML).toBe('');
    });

    it('Node with 1 element child', () => {
        const node = document.createElement('div');
        node.appendChild(document.createElement('span'));
        mergeNode(node);
        expect(node.innerHTML).toBe('<span></span>');
    });

    it('Node with 2 SPAN children, should merge', () => {
        const node = document.createElement('div');
        node.appendChild(document.createElement('span'));
        node.appendChild(document.createElement('span'));
        mergeNode(node);
        expect(node.innerHTML).toBe('<span></span>');
    });

    it('Node with 2 different children, should not merge', () => {
        const node = document.createElement('div');
        node.appendChild(document.createElement('span'));
        node.appendChild(document.createElement('b'));
        mergeNode(node);
        expect(node.innerHTML).toBe('<span></span><b></b>');
    });

    it('Node with 2 same children with non-optimize tag, should not merge', () => {
        const node = document.createElement('div');
        node.appendChild(document.createElement('span'));
        node.appendChild(document.createElement('div'));
        mergeNode(node);
        expect(node.innerHTML).toBe('<span></span><div></div>');
    });

    it('Node with 2 same children with same attributes, should merge', () => {
        const node = document.createElement('div');
        node.innerHTML = '<span style="color:red">test1</span><span style="color:red">test2</span>';
        mergeNode(node);
        expect(node.innerHTML).toBe('<span style="color:red">test1test2</span>');
    });

    it('Node with 2 same children with different attributes, should not merge', () => {
        const node = document.createElement('div');
        node.innerHTML =
            '<span style="color:red">test1</span><span style="color:green">test2</span>';
        mergeNode(node);
        expect(node.innerHTML).toBe(
            '<span style="color:red">test1</span><span style="color:green">test2</span>'
        );
    });

    it('Node with 3 children, two of them should be merged', () => {
        const node = document.createElement('div');
        node.innerHTML =
            '<span style="color:red">test1</span><span style="color:green">test2</span><span style="color:green">test3</span>';
        mergeNode(node);
        expect(node.innerHTML).toBe(
            '<span style="color:red">test1</span><span style="color:green">test2test3</span>'
        );
    });

    it('Node with 3 children that still have children, two of them should be merged', () => {
        const node = document.createElement('div');
        node.innerHTML =
            '<span style="color:red"><b>test1</b></span><span style="color:green"><i>test2</i></span><span style="color:green"><u>test3</u></span>';
        mergeNode(node);
        expect(node.innerHTML).toBe(
            '<span style="color:red"><b>test1</b></span><span style="color:green"><i>test2</i><u>test3</u></span>'
        );
    });
});
