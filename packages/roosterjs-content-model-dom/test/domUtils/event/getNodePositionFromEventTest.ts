import { getNodePositionFromEvent } from '../../../lib/domUtils/event/getNodePositionFromEvent';
import type { DOMHelper } from 'roosterjs-content-model-types';

describe('getNodePositionFromEvent', () => {
    let mockDoc: Document;
    let mockDomHelper: DOMHelper;
    let mockNode: Node;

    beforeEach(() => {
        mockNode = document.createElement('div');
        mockDomHelper = {
            isNodeInEditor: jasmine.createSpy('isNodeInEditor').and.returnValue(true),
        } as any;
        // Create empty mock - do NOT include methods as undefined, or 'in' check will pass
        mockDoc = {} as any;
    });

    describe('caretPositionFromPoint', () => {
        it('should return position from caretPositionFromPoint when available and node is in editor', () => {
            const mockPos = { offsetNode: mockNode, offset: 5 };
            (mockDoc as any).caretPositionFromPoint = jasmine
                .createSpy('caretPositionFromPoint')
                .and.returnValue(mockPos);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 100, 200);

            expect((mockDoc as any).caretPositionFromPoint).toHaveBeenCalledWith(100, 200);
            expect(mockDomHelper.isNodeInEditor).toHaveBeenCalledWith(mockNode);
            expect(result).toEqual({ node: mockNode, offset: 5 });
        });

        it('should not use caretPositionFromPoint result when node is not in editor', () => {
            const outsideNode = document.createElement('span');
            const mockPos = { offsetNode: outsideNode, offset: 3 };
            (mockDoc as any).caretPositionFromPoint = jasmine
                .createSpy('caretPositionFromPoint')
                .and.returnValue(mockPos);
            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.returnValue(false);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 100, 200);

            expect((mockDoc as any).caretPositionFromPoint).toHaveBeenCalledWith(100, 200);
            expect(mockDomHelper.isNodeInEditor).toHaveBeenCalledWith(outsideNode);
            expect(result).toBeNull();
        });

        it('should return null when caretPositionFromPoint returns null', () => {
            (mockDoc as any).caretPositionFromPoint = jasmine
                .createSpy('caretPositionFromPoint')
                .and.returnValue(null);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 100, 200);

            expect((mockDoc as any).caretPositionFromPoint).toHaveBeenCalledWith(100, 200);
            expect(result).toBeNull();
        });
    });

    describe('caretRangeFromPoint fallback', () => {
        it('should fall back to caretRangeFromPoint when caretPositionFromPoint is not available', () => {
            const mockRange = { startContainer: mockNode, startOffset: 7 };
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(mockRange);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 150, 250);

            expect(mockDoc.caretRangeFromPoint).toHaveBeenCalledWith(150, 250);
            expect(mockDomHelper.isNodeInEditor).toHaveBeenCalledWith(mockNode);
            expect(result).toEqual({ node: mockNode, offset: 7 });
        });

        it('should fall back to caretRangeFromPoint when caretPositionFromPoint returns node not in editor', () => {
            const outsideNode = document.createElement('span');
            const mockPos = { offsetNode: outsideNode, offset: 3 };
            (mockDoc as any).caretPositionFromPoint = jasmine
                .createSpy('caretPositionFromPoint')
                .and.returnValue(mockPos);

            const mockRange = { startContainer: mockNode, startOffset: 7 };
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(mockRange);

            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.callFake(
                (node: Node) => node === mockNode
            );

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 150, 250);

            expect((mockDoc as any).caretPositionFromPoint).toHaveBeenCalledWith(150, 250);
            expect(mockDoc.caretRangeFromPoint).toHaveBeenCalledWith(150, 250);
            expect(result).toEqual({ node: mockNode, offset: 7 });
        });

        it('should not use caretRangeFromPoint result when node is not in editor', () => {
            const outsideNode = document.createElement('span');
            const mockRange = { startContainer: outsideNode, startOffset: 2 };
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(mockRange);
            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.returnValue(false);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 150, 250);

            expect(mockDoc.caretRangeFromPoint).toHaveBeenCalledWith(150, 250);
            expect(mockDomHelper.isNodeInEditor).toHaveBeenCalledWith(outsideNode);
            expect(result).toBeNull();
        });

        it('should return null when caretRangeFromPoint returns null', () => {
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(null);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 150, 250);

            expect(mockDoc.caretRangeFromPoint).toHaveBeenCalledWith(150, 250);
            expect(result).toBeNull();
        });
    });

    describe('elementFromPoint fallback', () => {
        it('should fall back to elementFromPoint when other methods are not available', () => {
            const mockElement = document.createElement('p');
            mockDoc.elementFromPoint = jasmine
                .createSpy('elementFromPoint')
                .and.returnValue(mockElement);
            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.returnValue(true);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 200, 300);

            expect(mockDoc.elementFromPoint).toHaveBeenCalledWith(200, 300);
            expect(mockDomHelper.isNodeInEditor).toHaveBeenCalledWith(mockElement);
            expect(result).toEqual({ node: mockElement, offset: 0 });
        });

        it('should fall back to elementFromPoint when caretRangeFromPoint returns node not in editor', () => {
            const outsideNode = document.createElement('span');
            const mockRange = { startContainer: outsideNode, startOffset: 2 };
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(mockRange);

            const mockElement = document.createElement('p');
            mockDoc.elementFromPoint = jasmine
                .createSpy('elementFromPoint')
                .and.returnValue(mockElement);

            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.callFake(
                (node: Node) => node === mockElement
            );

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 200, 300);

            expect(mockDoc.caretRangeFromPoint).toHaveBeenCalledWith(200, 300);
            expect(mockDoc.elementFromPoint).toHaveBeenCalledWith(200, 300);
            expect(result).toEqual({ node: mockElement, offset: 0 });
        });

        it('should not use elementFromPoint result when element is not in editor', () => {
            const outsideElement = document.createElement('div');
            mockDoc.elementFromPoint = jasmine
                .createSpy('elementFromPoint')
                .and.returnValue(outsideElement);
            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.returnValue(false);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 200, 300);

            expect(mockDoc.elementFromPoint).toHaveBeenCalledWith(200, 300);
            expect(mockDomHelper.isNodeInEditor).toHaveBeenCalledWith(outsideElement);
            expect(result).toBeNull();
        });

        it('should return null when elementFromPoint returns null', () => {
            mockDoc.elementFromPoint = jasmine.createSpy('elementFromPoint').and.returnValue(null);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 200, 300);

            expect(mockDoc.elementFromPoint).toHaveBeenCalledWith(200, 300);
            expect(result).toBeNull();
        });
    });

    describe('no methods available', () => {
        it('should return null when no positioning methods are available', () => {
            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 100, 100);

            expect(result).toBeNull();
        });
    });

    describe('priority order', () => {
        it('should prefer caretPositionFromPoint over caretRangeFromPoint', () => {
            const posNode = document.createElement('div');
            const rangeNode = document.createElement('span');

            const mockPos = { offsetNode: posNode, offset: 1 };
            (mockDoc as any).caretPositionFromPoint = jasmine
                .createSpy('caretPositionFromPoint')
                .and.returnValue(mockPos);

            const mockRange = { startContainer: rangeNode, startOffset: 2 };
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(mockRange);

            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.returnValue(true);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 100, 100);

            expect((mockDoc as any).caretPositionFromPoint).toHaveBeenCalled();
            expect(mockDoc.caretRangeFromPoint).not.toHaveBeenCalled();
            expect(result).toEqual({ node: posNode, offset: 1 });
        });

        it('should prefer caretRangeFromPoint over elementFromPoint', () => {
            const rangeNode = document.createElement('span');
            const elementNode = document.createElement('p');

            const mockRange = { startContainer: rangeNode, startOffset: 3 };
            mockDoc.caretRangeFromPoint = jasmine
                .createSpy('caretRangeFromPoint')
                .and.returnValue(mockRange);

            mockDoc.elementFromPoint = jasmine
                .createSpy('elementFromPoint')
                .and.returnValue(elementNode);

            (mockDomHelper.isNodeInEditor as jasmine.Spy).and.returnValue(true);

            const result = getNodePositionFromEvent(mockDoc, mockDomHelper, 100, 100);

            expect(mockDoc.caretRangeFromPoint).toHaveBeenCalled();
            expect(mockDoc.elementFromPoint).not.toHaveBeenCalled();
            expect(result).toEqual({ node: rangeNode, offset: 3 });
        });
    });
});
