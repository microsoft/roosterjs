import * as getRangesByText from 'roosterjs-content-model-dom/lib/domUtils/getRangesByText';
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

        it('isNodeInEditor, check root node, excludeRoot=false', () => {
            const div = document.createElement('div');
            const domHelper = createDOMHelper(div);

            const result = domHelper.isNodeInEditor(div);

            expect(result).toBeTrue();
        });

        it('isNodeInEditor, check root node, excludeRoot=true', () => {
            const div = document.createElement('div');
            const domHelper = createDOMHelper(div);

            const result = domHelper.isNodeInEditor(div, true);

            expect(result).toBeFalse();
        });

        it('isNodeInEditor, check root node, excludeRoot=true, do not call contains', () => {
            const containsSpy = jasmine.createSpy('contains');
            const mockedDiv = {
                contains: containsSpy,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.isNodeInEditor(mockedDiv, true);

            expect(result).toBeFalse();
            expect(containsSpy).not.toHaveBeenCalled();
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

    describe('getClonedRoot', () => {
        it('getClonedRoot', () => {
            const mockedClone = 'CLONE' as any;
            const cloneSpy = jasmine.createSpy('cloneSpy').and.returnValue(mockedClone);
            const mockedDiv: HTMLElement = {
                cloneNode: cloneSpy,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.getClonedRoot();

            expect(result).toBe(mockedClone);
            expect(cloneSpy).toHaveBeenCalledWith(true);
        });

        it('getClonedRoot, with CloneIndependentRoot on', () => {
            const mockedClone = 'CLONE' as any;
            const cloneSpy = jasmine.createSpy('cloneSpy').and.returnValue(mockedClone);
            const importNodeSpy = jasmine.createSpy('importNodeSpy').and.returnValue(mockedClone);
            const mockedDiv: HTMLElement = {
                cloneNode: cloneSpy,
                ownerDocument: {
                    implementation: {
                        createHTMLDocument: () => ({
                            importNode: importNodeSpy,
                        }),
                    },
                },
            } as any;
            const domHelper = createDOMHelper(mockedDiv, {
                cloneIndependentRoot: true,
            });

            const result = domHelper.getClonedRoot();

            expect(result).toBe(mockedClone);
            expect(cloneSpy).not.toHaveBeenCalled();
            expect(importNodeSpy).toHaveBeenCalledWith(mockedDiv, true);
        });
    });

    describe('getContainerFormat', () => {
        it('getContainerFormat', () => {
            const mockedDiv: HTMLDivElement = {
                ownerDocument: {
                    defaultView: {
                        getComputedStyle: () => ({
                            fontSize: '12px',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            color: 'red',
                            backgroundColor: 'blue',
                            fontStyle: 'italic',
                            letterSpacing: '1px',
                            lineHeight: '1.5',
                            textDecoration: 'line-through underline',
                            verticalAlign: 'super',
                        }),
                    },
                },
                style: {},
                getAttribute: (): null => null,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.getContainerFormat();

            expect(result).toEqual({
                fontSize: '12px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                textColor: 'red',
                backgroundColor: 'blue',
                italic: true,
                letterSpacing: '1px',
                lineHeight: '1.5',
                strikethrough: true,
                superOrSubScriptSequence: 'super',
                underline: true,
            });
        });

        it('getContainerFormat use style color', () => {
            const mockedDiv: HTMLDivElement = {
                ownerDocument: {
                    defaultView: {
                        getComputedStyle: () => ({
                            fontSize: '12px',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            color: 'red',
                            backgroundColor: 'blue',
                            fontStyle: 'italic',
                            letterSpacing: '1px',
                            lineHeight: '1.5',
                            textDecoration: 'line-through underline',
                            verticalAlign: 'super',
                        }),
                    },
                },
                style: {
                    color: 'style-color',
                    backgroundColor: 'style-bg-color',
                },
                getAttribute: (): null => null,
            } as any;
            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.getContainerFormat();

            expect(result).toEqual({
                fontSize: '12px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                textColor: 'style-color',
                backgroundColor: 'style-bg-color',
                italic: true,
                letterSpacing: '1px',
                lineHeight: '1.5',
                strikethrough: true,
                superOrSubScriptSequence: 'super',
                underline: true,
            });
        });

        it('getContainerFormat use style color in dark mode', () => {
            const mockedDiv: HTMLDivElement = {
                ownerDocument: {
                    defaultView: {
                        getComputedStyle: () => ({
                            fontSize: '12px',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            color: 'red',
                            backgroundColor: 'blue',
                            fontStyle: 'italic',
                            letterSpacing: '1px',
                            lineHeight: '1.5',
                            textDecoration: 'line-through underline',
                            verticalAlign: 'super',
                        }),
                    },
                },
                style: {
                    color: 'var(--darkColor, lightColor)',
                    backgroundColor: 'var(--darkBgColor, lightBgColor)',
                },
                getAttribute: (): null => null,
            } as any;
            const mockDarkHandler = {} as any;

            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.getContainerFormat(true, mockDarkHandler);

            expect(result).toEqual({
                fontSize: '12px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                textColor: 'lightColor',
                backgroundColor: 'lightBgColor',
                italic: true,
                letterSpacing: '1px',
                lineHeight: '1.5',
                strikethrough: true,
                superOrSubScriptSequence: 'super',
                underline: true,
            });
        });

        it('getContainerFormat use runtime color in dark mode', () => {
            const mockedDiv: HTMLDivElement = {
                ownerDocument: {
                    defaultView: {
                        getComputedStyle: () => ({
                            fontSize: '12px',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            color: 'var(--darkColor, lightColor)',
                            backgroundColor: 'var(--darkBgColor, lightBgColor)',
                            fontStyle: 'italic',
                            letterSpacing: '1px',
                            lineHeight: '1.5',
                            textDecoration: 'line-through underline',
                            verticalAlign: 'super',
                        }),
                    },
                },
                style: {},
                getAttribute: (): null => null,
            } as any;
            const mockDarkHandler = {} as any;

            const domHelper = createDOMHelper(mockedDiv);

            const result = domHelper.getContainerFormat(true, mockDarkHandler);

            expect(result).toEqual({
                fontSize: '12px',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                textColor: 'lightColor',
                backgroundColor: 'lightBgColor',
                italic: true,
                letterSpacing: '1px',
                lineHeight: '1.5',
                strikethrough: true,
                superOrSubScriptSequence: 'super',
                underline: true,
            });
        });
    });

    describe('DOMHelperImpl.findClosestBlockElement', () => {
        let contentDiv: HTMLElement;
        let domHelper: DOMHelper;

        beforeEach(() => {
            contentDiv = document.createElement('div');
            contentDiv.innerHTML = `
            <div id="block1">
                <span id="inline1">
                    <em id="inline2">text</em>
                </span>
                <p id="block2">
                    <strong id="inline3">paragraph text</strong>
                </p>
            </div>
            <section id="block3">
                <span id="inline4">section content</span>
            </section>
        `;
            document.body.appendChild(contentDiv);
            domHelper = createDOMHelper(contentDiv);
        });

        afterEach(() => {
            document.body.removeChild(contentDiv);
        });

        it('should return the closest block element when starting from inline element', () => {
            const inlineElement = contentDiv.querySelector('#inline1') as HTMLElement;
            const result = domHelper.findClosestBlockElement(inlineElement);

            expect(result.id).toBe('block1');
        });

        it('should return the same element when starting from block element', () => {
            const blockElement = contentDiv.querySelector('#block2') as HTMLElement;
            const result = domHelper.findClosestBlockElement(blockElement);

            expect(result.id).toBe('block2');
        });

        it('should return closest block element when starting from text node', () => {
            const textNode = contentDiv.querySelector('#inline2')?.firstChild as Text;
            const result = domHelper.findClosestBlockElement(textNode);

            expect(result.id).toBe('block1');
        });

        it('should return closest block element when starting from deeply nested inline element', () => {
            const deepInline = contentDiv.querySelector('#inline2') as HTMLElement;
            const result = domHelper.findClosestBlockElement(deepInline);

            expect(result.id).toBe('block1');
        });

        it('should return contentDiv when no block element is found', () => {
            const orphanSpan = document.createElement('span');
            orphanSpan.textContent = 'orphan';

            const result = domHelper.findClosestBlockElement(orphanSpan);

            expect(result).toBe(contentDiv);
        });

        it('should return contentDiv when starting from node outside editor', () => {
            const outsideElement = document.createElement('div');
            document.body.appendChild(outsideElement);

            const result = domHelper.findClosestBlockElement(outsideElement);

            expect(result).toBe(contentDiv);

            document.body.removeChild(outsideElement);
        });

        it('should traverse up through multiple inline elements to find block', () => {
            const nestedInline = contentDiv.querySelector('#inline3') as HTMLElement;
            const result = domHelper.findClosestBlockElement(nestedInline);

            expect(result.id).toBe('block2');
        });
    });

    describe('DOMHelperImpl.getRangesByText', () => {
        let contentDiv: HTMLElement;
        let domHelper: DOMHelper;
        let getRangesByTextSpy: jasmine.Spy;

        beforeEach(() => {
            contentDiv = document.createElement('div');
            domHelper = createDOMHelper(contentDiv);
            getRangesByTextSpy = spyOn(getRangesByText, 'getRangesByText');
        });

        it('call getRangesByText', () => {
            const ranges = domHelper.getRangesByText('test', false, true);

            expect(getRangesByTextSpy).toHaveBeenCalledWith(contentDiv, 'test', false, true, true);
            expect(ranges).toBe(getRangesByTextSpy.calls.mostRecent().returnValue);
        });
    });
});
