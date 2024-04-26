import { createDOMHelper } from '../../../lib/editor/core/DOMHelperImpl';
import { DOMHelper } from 'roosterjs-content-model-types';

describe('DOMHelperImpl', () => {
    describe('isNodeInEditor', () => {
        it('isNodeInEditor', () => {
            const mockedResult = 'RESULT' as any;
            const containsSpy = jasmine.createSpy('contains').and.returnValue(mockedResult);
            const mockedDiv = {
                contains: containsSpy,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);
            const mockedNode = 'NODE' as any;

            const result = domHelper.isNodeInEditor(mockedNode);

            expect(result).toBe(mockedResult);
            expect(containsSpy).toHaveBeenCalledWith(mockedNode);
        });

        it('isNodeInEditor - exclude root', () => {
            const mockedResult = 'RESULT' as any;
            const containsSpy = jasmine.createSpy('contains').and.returnValue(mockedResult);
            const mockedDiv = {
                contains: containsSpy,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.isNodeInEditor(mockedDiv, true);

            expect(result).toBeFalse();
            expect(containsSpy).toHaveBeenCalledWith(mockedDiv);
        });
    });

    describe('queryElements', () => {
        it('queryElements', () => {
            const mockedResult = ['RESULT'] as any;
            const querySelectorAllSpy = jasmine
                .createSpy('querySelectorAll')
                .and.returnValue(mockedResult);
            const mockedDiv: HTMLElement = {
                querySelectorAll: querySelectorAllSpy,
            } as any;
            const mockedSelector = 'SELECTOR';
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.queryElements(mockedSelector);

            expect(result).toEqual(mockedResult);
            expect(querySelectorAllSpy).toHaveBeenCalledWith(mockedSelector);
        });
    });

    describe('getTextContent', () => {
        it('getTextContent', () => {
            const mockedTextContent = 'TEXT';
            const mockedDiv: HTMLDivElement = {
                textContent: mockedTextContent,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.getTextContent();

            expect(result).toBe(mockedTextContent);
        });
    });

    describe('calculateZoomScale', () => {
        it('calculateZoomScale 1', () => {
            const mockedDiv = {
                getBoundingClientRect: () => ({
                    width: 1,
                }),
                offsetWidth: 2,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const zoomScale = domHelper.calculateZoomScale();

            expect(zoomScale).toBe(0.5);
        });

        it('calculateZoomScale 2', () => {
            const mockedDiv = {
                getBoundingClientRect: () => ({
                    width: 1,
                }),
                offsetWidth: 0, // Wrong number, should return 1 as fallback
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const zoomScale = domHelper.calculateZoomScale();

            expect(zoomScale).toBe(1);
        });
    });

    describe('getDomAttribute', () => {
        it('getDomAttribute', () => {
            const mockedAttr = 'ATTR';
            const mockedValue = 'VALUE';
            const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedValue);
            const mockedDiv = {
                getAttribute: getAttributeSpy,
            } as any;

            const domHelper = createDOMHelper(mockedDiv);
            const result = domHelper.getDomAttribute(mockedAttr);

            expect(result).toBe(mockedValue);
            expect(getAttributeSpy).toHaveBeenCalledWith(mockedAttr);
        });
    });

    describe('setDomAttribute', () => {
        it('setDomAttribute', () => {
            const mockedAttr1 = 'ATTR1';
            const mockedAttr2 = 'ATTR2';
            const mockedValue = 'VALUE';
            const setAttributeSpy = jasmine.createSpy('setAttribute');
            const removeAttributeSpy = jasmine.createSpy('removeAttribute');
            const mockedDiv = {
                setAttribute: setAttributeSpy,
                removeAttribute: removeAttributeSpy,
            } as any;

            const domHelper = createDOMHelper(mockedDiv);
            domHelper.setDomAttribute(mockedAttr1, mockedValue);

            expect(setAttributeSpy).toHaveBeenCalledWith(mockedAttr1, mockedValue);
            expect(removeAttributeSpy).not.toHaveBeenCalled();

            domHelper.setDomAttribute(mockedAttr2, null);
            expect(removeAttributeSpy).toHaveBeenCalledWith(mockedAttr2);
        });
    });

    describe('getDomStyle', () => {
        it('getDomStyle', () => {
            const mockedValue = 'COLOR' as any;
            const styleName: keyof CSSStyleDeclaration = 'backgroundColor';
            const styleSpy = jasmine.createSpyObj('style', [styleName]);
            styleSpy[styleName] = mockedValue;
            const mockedDiv = {
                style: styleSpy,
            } as any;

            const domHelper = createDOMHelper(mockedDiv);
            const result = domHelper.getDomStyle(styleName);

            expect(result).toBe(mockedValue);
        });
    });

    describe('findClosestElementAncestor', () => {
        it('findClosestElementAncestor - text node, no parent, no selector', () => {
            const startNode = document.createTextNode('test');
            const container = document.createElement('div');

            container.appendChild(startNode);

            const domHelper = createDOMHelper(container);
            const result = domHelper.findClosestElementAncestor(startNode);

            expect(result).toBeNull();
        });

        it('findClosestElementAncestor - text node, has parent, no selector', () => {
            const startNode = document.createTextNode('test');
            const parent = document.createElement('span');
            const container = document.createElement('div');

            parent.appendChild(startNode);
            container.appendChild(parent);

            const domHelper = createDOMHelper(container);
            const result = domHelper.findClosestElementAncestor(startNode);

            expect(result).toBe(parent);
        });

        it('findClosestElementAncestor - element node, no selector', () => {
            const startNode = document.createElement('span');
            const container = document.createElement('div');

            container.appendChild(startNode);

            const domHelper = createDOMHelper(container);
            const result = domHelper.findClosestElementAncestor(startNode);

            expect(result).toBe(startNode);
        });

        it('findClosestElementAncestor - has selector', () => {
            const startNode = document.createElement('span');
            const parent1 = document.createElement('div');
            const parent2 = document.createElement('div');
            const container = document.createElement('div');

            parent2.className = 'testClass';

            parent1.appendChild(startNode);
            parent2.appendChild(parent1);
            container.appendChild(parent2);

            const domHelper = createDOMHelper(container);
            const result = domHelper.findClosestElementAncestor(startNode, '.testClass');

            expect(result).toBe(parent2);
        });
    });

    describe('hasFocus', () => {
        let containsSpy: jasmine.Spy;
        let mockedElement = 'ELEMENT' as any;
        let mockedRoot: HTMLElement;
        let domHelper: DOMHelper;

        beforeEach(() => {
            containsSpy = jasmine.createSpy('contains');
            mockedRoot = {
                ownerDocument: {
                    activeElement: mockedElement,
                },
                contains: containsSpy,
            } as any;

            domHelper = createDOMHelper(mockedRoot);
        });

        it('Has active element inside editor', () => {
            containsSpy.and.returnValue(true);

            let result = domHelper.hasFocus();

            expect(result).toBe(true);
        });

        it('Has active element outside editor', () => {
            containsSpy.and.returnValue(false);

            let result = domHelper.hasFocus();

            expect(result).toBe(false);
        });

        it('No active element', () => {
            (mockedRoot.ownerDocument as any).activeElement = null;

            let result = domHelper.hasFocus();

            expect(result).toBe(false);
        });
    });

    describe('isRightToLeft', () => {
        let div: HTMLDivElement;
        let getComputedStyleSpy: jasmine.Spy;

        beforeEach(() => {
            getComputedStyleSpy = jasmine.createSpy('getComputedStyle');

            div = {
                ownerDocument: {
                    defaultView: {
                        getComputedStyle: getComputedStyleSpy,
                    },
                },
            } as any;
        });

        it('LTR', () => {
            const domHelper = createDOMHelper(div);

            getComputedStyleSpy.and.returnValue({
                direction: 'ltr',
            });

            const result = domHelper.isRightToLeft();

            expect(getComputedStyleSpy).toHaveBeenCalledWith(div);
            expect(result).toBeFalse();
        });

        it('RTL', () => {
            const domHelper = createDOMHelper(div);

            getComputedStyleSpy.and.returnValue({
                direction: 'rtl',
            });

            const result = domHelper.isRightToLeft();

            expect(getComputedStyleSpy).toHaveBeenCalledWith(div);
            expect(result).toBeTrue();
        });
    });

    describe('getClientWidth', () => {
        let div: HTMLDivElement;
        let getComputedStyleSpy: jasmine.Spy;

        beforeEach(() => {
            getComputedStyleSpy = jasmine.createSpy('getComputedStyle');

            div = {
                ownerDocument: {
                    defaultView: {
                        getComputedStyle: getComputedStyleSpy,
                    },
                },
                clientWidth: 1000,
            } as any;
        });

        it('getClientWidth', () => {
            const domHelper = createDOMHelper(div);

            getComputedStyleSpy.and.returnValue({
                paddingLeft: '10px',
                paddingRight: '10px',
            });

            expect(domHelper.getClientWidth()).toBe(980);
        });

        it('getClientWidth', () => {
            const domHelper = createDOMHelper(div);

            getComputedStyleSpy.and.returnValue({});

            expect(domHelper.getClientWidth()).toBe(1000);
        });
    });
});
