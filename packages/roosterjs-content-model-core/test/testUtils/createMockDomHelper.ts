import type { DOMHelper } from 'roosterjs-content-model-types';

/**
 * Creates a mock DOMHelper with safe no-op defaults. Pass spies or custom implementations
 * via `overrides` to control specific methods in your test.
 */
export function createMockDomHelper(
    overrides?: Partial<DOMHelper>
): DOMHelper & { [K in keyof DOMHelper]: jasmine.Spy } {
    const defaults: DOMHelper = {
        isNodeInEditor: jasmine.createSpy('isNodeInEditor').and.returnValue(false),
        queryElements: jasmine.createSpy('queryElements').and.returnValue([]),
        getTextContent: jasmine.createSpy('getTextContent').and.returnValue(''),
        calculateZoomScale: jasmine.createSpy('calculateZoomScale').and.returnValue(1),
        setDomAttribute: jasmine.createSpy('setDomAttribute'),
        getDomAttribute: jasmine.createSpy('getDomAttribute').and.returnValue(null),
        getDomStyle: jasmine.createSpy('getDomStyle').and.returnValue(''),
        findClosestElementAncestor: jasmine
            .createSpy('findClosestElementAncestor')
            .and.returnValue(null),
        findClosestBlockElement: jasmine
            .createSpy('findClosestBlockElement')
            .and.returnValue(null as any),
        hasFocus: jasmine.createSpy('hasFocus').and.returnValue(false),
        isRightToLeft: jasmine.createSpy('isRightToLeft').and.returnValue(false),
        getClientWidth: jasmine.createSpy('getClientWidth').and.returnValue(800),
        getClonedRoot: jasmine.createSpy('getClonedRoot').and.returnValue(null as any),
        getContainerFormat: jasmine.createSpy('getContainerFormat').and.returnValue({}),
        getRangesByText: jasmine.createSpy('getRangesByText').and.returnValue([]),
        getSelectionRange: jasmine.createSpy('getSelectionRange').and.returnValue(null),
        setSelectionRange: jasmine.createSpy('setSelectionRange'),
        appendToRoot: jasmine.createSpy('appendToRoot'),
    };

    return { ...defaults, ...overrides } as any;
}
