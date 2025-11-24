import { cleanUpRestNodes } from '../../../lib/modelToDom/utils/cleanUpRestNodes';
import type { RewriteFromModel } from 'roosterjs-content-model-types';

describe('cleanUpRestNodes', () => {
    let rewriteContext: RewriteFromModel;
    let parent: HTMLElement;
    let firstChild: HTMLElement;
    let refNode: HTMLElement;
    let sibling1: HTMLElement;
    let sibling2: HTMLElement;
    let removedElements: Node[];

    beforeEach(() => {
        removedElements = [];
        rewriteContext = {
            removedBlockElements: removedElements,
        } as RewriteFromModel;
        parent = document.createElement('div');
        firstChild = document.createElement('b');
        refNode = document.createElement('p');
        sibling1 = document.createElement('span');
        sibling2 = document.createElement('div');
    });

    it('No refNode', () => {
        cleanUpRestNodes(null, rewriteContext);

        expect(removedElements.length).toBe(0);
    });

    it('With refNode and siblings', () => {
        parent.appendChild(firstChild);
        parent.appendChild(refNode);
        parent.appendChild(sibling1);
        parent.appendChild(sibling2);
        cleanUpRestNodes(refNode, rewriteContext);

        expect(parent.outerHTML).toBe('<div><b></b></div>');
        expect(removedElements).toEqual([refNode, sibling1, sibling2]);
    });

    it('With only refNode', () => {
        parent.appendChild(refNode);
        cleanUpRestNodes(refNode, rewriteContext);
        expect(parent.outerHTML).toBe('<div></div>');
        expect(removedElements).toEqual([refNode]);
    });

    it('With refNode without parent', () => {
        cleanUpRestNodes(refNode, rewriteContext);
        expect(removedElements).toEqual([]);
    });
});
