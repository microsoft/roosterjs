import { commitEntity } from 'roosterjs-editor-dom';
import { reuseCachedElement } from '../../../lib/modelToDom/utils/reuseCachedElement';

describe('reuseCachedElement', () => {
    it('No refNode', () => {
        const parent = document.createElement('div');
        const element = document.createElement('span');

        const result = reuseCachedElement(parent, element, null);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(parent.firstChild).toBe(element);
        expect(result).toBe(null);
    });

    it('RefNode is not current element', () => {
        const parent = document.createElement('div');
        const element = document.createElement('span');
        const refNode = document.createElement('br');

        parent.appendChild(refNode);

        const result = reuseCachedElement(parent, element, refNode);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(element);
        expect(result).toBe(refNode);
    });

    it('RefNode is current element', () => {
        const parent = document.createElement('div');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');

        parent.appendChild(element);
        parent.appendChild(nextNode);

        const result = reuseCachedElement(parent, element, element);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(nextNode);
        expect(result).toBe(nextNode);
    });

    it('RefNode is before current element', () => {
        const parent = document.createElement('div');
        const refNode = document.createElement('hr');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');

        parent.appendChild(refNode);
        parent.appendChild(element);
        parent.appendChild(nextNode);

        const result = reuseCachedElement(parent, element, refNode);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(nextNode);
        expect(result).toBe(nextNode);
    });

    it('RefNode is entity', () => {
        const parent = document.createElement('div');
        const refNode = document.createElement('div');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');

        parent.appendChild(refNode);
        parent.appendChild(element);
        parent.appendChild(nextNode);

        commitEntity(refNode, 'TestEntity', true);

        const result = reuseCachedElement(parent, element, refNode);

        expect(parent.outerHTML).toBe(
            '<div><span></span><div class="_Entity _EType_TestEntity _EReadonly_1" contenteditable="false"></div><br></div>'
        );
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(refNode);
        expect(result).toBe(refNode);
    });
});
