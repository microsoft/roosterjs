import { announce } from '../../../lib/coreApi/announce/announce';
import { EditorCore } from 'roosterjs-content-model-types';

describe('announce', () => {
    let core: EditorCore;
    let createElementSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let getterSpy: jasmine.Spy;

    beforeEach(() => {
        createElementSpy = jasmine.createSpy('createElement');
        appendChildSpy = jasmine.createSpy('appendChild');
        getterSpy = jasmine.createSpy('getter');

        core = {
            lifecycle: {
                announcerStringGetter: getterSpy,
            },
            physicalRoot: {
                ownerDocument: {
                    createElement: createElementSpy,
                    body: {
                        appendChild: appendChildSpy,
                    },
                },
            },
        } as any;
    });

    it('announce empty string', () => {
        const mockedDiv = {
            style: {},
        } as any;
        createElementSpy.and.returnValue(mockedDiv);

        announce(core, {});

        expect(createElementSpy).toHaveBeenCalled();
        expect(appendChildSpy).toHaveBeenCalled();
        expect(mockedDiv.textContent).toBeUndefined();
    });

    it('announce a given string', () => {
        const mockedDiv = {
            style: {},
        } as any;

        createElementSpy.and.returnValue(mockedDiv);
        announce(core, {
            text: 'test',
        });

        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedDiv);
        expect(mockedDiv).toEqual({
            style: {
                clip: 'rect(0px, 0px, 0px, 0px)',
                clipPath: 'inset(100%)',
                height: '1px',
                overflow: 'hidden',
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
            },
            ariaLive: 'assertive',
            textContent: 'test',
        });
    });

    it('announce a default string', () => {
        const mockedDiv = {
            style: {},
        } as any;

        createElementSpy.and.returnValue(mockedDiv);
        getterSpy.and.returnValue('test');

        announce(core, {
            defaultStrings: 'announceListItemBullet',
        });

        expect(getterSpy).toHaveBeenCalledWith('announceListItemBullet');
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedDiv);
        expect(mockedDiv).toEqual({
            style: {
                clip: 'rect(0px, 0px, 0px, 0px)',
                clipPath: 'inset(100%)',
                height: '1px',
                overflow: 'hidden',
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
            },
            ariaLive: 'assertive',
            textContent: 'test',
        });
    });

    it('announce a default string with format', () => {
        const mockedDiv = {
            style: {},
        } as any;

        createElementSpy.and.returnValue(mockedDiv);
        getterSpy.and.returnValue('test1 {0} test2');

        announce(core, {
            defaultStrings: 'announceListItemBullet',
            formatStrings: ['replace1', 'replace2'],
        });

        expect(getterSpy).toHaveBeenCalledWith('announceListItemBullet');
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedDiv);
        expect(mockedDiv).toEqual({
            style: {
                clip: 'rect(0px, 0px, 0px, 0px)',
                clipPath: 'inset(100%)',
                height: '1px',
                overflow: 'hidden',
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
            },
            ariaLive: 'assertive',
            textContent: 'test1 replace1 test2',
        });
    });

    it('announce a default string with complex format', () => {
        const mockedDiv = {
            style: {},
        } as any;

        createElementSpy.and.returnValue(mockedDiv);
        getterSpy.and.returnValue('test1 {0} test2 {1} {0}');

        announce(core, {
            defaultStrings: 'announceListItemBullet',
            formatStrings: ['replace1', 'replace2'],
        });

        expect(getterSpy).toHaveBeenCalledWith('announceListItemBullet');
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedDiv);
        expect(mockedDiv).toEqual({
            style: {
                clip: 'rect(0px, 0px, 0px, 0px)',
                clipPath: 'inset(100%)',
                height: '1px',
                overflow: 'hidden',
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
            },
            ariaLive: 'assertive',
            textContent: 'test1 replace1 test2 replace2 replace1',
        });
    });

    it('already has div with different text', () => {
        const removeChildSpy = jasmine.createSpy('removeChild');
        const mockedDiv = {
            textContent: '',
            parentElement: {
                removeChild: removeChildSpy,
            },
        } as any;

        core.lifecycle.announceContainer = mockedDiv;

        createElementSpy.and.returnValue(mockedDiv);
        announce(core, {
            text: 'test',
        });

        expect(removeChildSpy).not.toHaveBeenCalled();
        expect(createElementSpy).not.toHaveBeenCalled();
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(mockedDiv).toEqual({
            textContent: 'test',
            parentElement: {
                removeChild: removeChildSpy,
            },
        });
    });

    it('already has div with same text', () => {
        const mockedDiv = {
            textContent: 'test',
        } as any;

        core.lifecycle.announceContainer = mockedDiv;

        announce(core, {
            text: 'test',
        });

        expect(mockedDiv).toEqual({
            textContent: 'test.',
        });
    });
});
