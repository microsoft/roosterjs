import { reuseCachedElement } from '../../lib/domUtils/reuseCachedElement';
import { setEntityElementClasses } from './entityUtilTest';
import type { DomModification } from 'roosterjs-content-model-types';

describe('reuseCachedElement', () => {
    it('No refNode', () => {
        const parent = document.createElement('div');
        const element = document.createElement('span');
        const context: DomModification = {
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const result = reuseCachedElement(parent, element, null, context);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(parent.firstChild).toBe(element);
        expect(result).toBe(null);
        expect(context).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('RefNode is not current element', () => {
        const parent = document.createElement('div');
        const element = document.createElement('span');
        const refNode = document.createElement('br');

        parent.appendChild(refNode);

        const context: DomModification = {
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const result = reuseCachedElement(parent, element, refNode, context);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(element);
        expect(result).toBe(refNode);
        expect(context).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('RefNode is current element', () => {
        const parent = document.createElement('div');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');

        parent.appendChild(element);
        parent.appendChild(nextNode);

        const context: DomModification = {
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const result = reuseCachedElement(parent, element, element, context);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(nextNode);
        expect(result).toBe(nextNode);
        expect(context).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('RefNode is before current element', () => {
        const parent = document.createElement('div');
        const hr = document.createElement('hr');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');
        const refNode = hr;

        parent.appendChild(refNode);
        parent.appendChild(element);
        parent.appendChild(nextNode);

        const context: DomModification = {
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const result = reuseCachedElement(parent, element, refNode, context);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(nextNode);
        expect(result).toBe(nextNode);
        expect(context).toEqual({
            addedBlockElements: [],
            removedBlockElements: [hr],
        });
    });

    it('RefNode is entity', () => {
        const parent = document.createElement('div');
        const refNode = document.createElement('div');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');
        const removeChildSpy = spyOn(Node.prototype, 'removeChild').and.callThrough();

        parent.appendChild(refNode);
        parent.appendChild(element);
        parent.appendChild(nextNode);

        setEntityElementClasses(refNode, 'TestEntity', true);

        const context: DomModification = {
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const result = reuseCachedElement(parent, element, refNode, context);

        expect(removeChildSpy).not.toHaveBeenCalled();
        expect(parent.outerHTML).toBe(
            '<div><span></span><div class="_Entity _EType_TestEntity _EReadonly_1" contenteditable="false"></div><br></div>'
        );
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(refNode);
        expect(result).toBe(refNode);
        expect(context).toEqual({
            addedBlockElements: [],
            removedBlockElements: [],
        });
    });

    it('RefNode is entity, current element is entity', () => {
        const parent = document.createElement('div');
        const entity = document.createElement('div');
        const element = document.createElement('span');
        const nextNode = document.createElement('br');
        const removeChildSpy = spyOn(Node.prototype, 'removeChild').and.callThrough();
        const refNode = entity;

        parent.appendChild(refNode);
        parent.appendChild(element);
        parent.appendChild(nextNode);

        setEntityElementClasses(refNode, 'TestEntity', true);
        setEntityElementClasses(element, 'TestEntity2', true);

        const context: DomModification = {
            addedBlockElements: [],
            removedBlockElements: [],
        };

        const result = reuseCachedElement(parent, element, refNode, context);

        expect(removeChildSpy).toHaveBeenCalledTimes(1);
        expect(removeChildSpy).toHaveBeenCalledWith(refNode);

        expect(parent.outerHTML).toBe(
            '<div><span class="_Entity _EType_TestEntity2 _EReadonly_1" contenteditable="false"></span><br></div>'
        );
        expect(parent.firstChild).toBe(element);
        expect(parent.firstChild?.nextSibling).toBe(nextNode);
        expect(result).toBe(nextNode);
        expect(context).toEqual({
            addedBlockElements: [],
            removedBlockElements: [entity],
        });
    });
});
