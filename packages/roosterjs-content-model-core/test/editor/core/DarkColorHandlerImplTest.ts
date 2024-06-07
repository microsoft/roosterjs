import { createDarkColorHandler } from '../../../lib/editor/core/DarkColorHandlerImpl';

describe('DarkColorHandlerImpl.ctor', () => {
    it('no knownColors', () => {
        const div = document.createElement('div');
        const mockedGetDarkColor = jasmine.createSpy('getDarkColor');
        const handler = createDarkColorHandler(div, mockedGetDarkColor);

        expect(handler.knownColors).toEqual({});
        expect(handler.getDarkColor).toBe(mockedGetDarkColor);

        const mockedColor = 'MOCKCOLOR' as any;
        const mockedBaseLValue = 'L' as any;
        const mockedType = 'Type' as any;
        const mockedElement = 'ELEMENT' as any;

        handler.getDarkColor(mockedColor);

        expect(mockedGetDarkColor).toHaveBeenCalledWith(mockedColor);

        handler.getDarkColor(mockedColor, mockedBaseLValue, mockedType, mockedElement);

        expect(mockedGetDarkColor).toHaveBeenCalledWith(
            mockedColor,
            mockedBaseLValue,
            mockedType,
            mockedElement
        );
    });

    it('with knownColors and generateColorKey', () => {
        const div = document.createElement('div');
        const mockedGetDarkColor = jasmine.createSpy('getDarkColor');
        const mockedKnownColors = 'KNOWN' as any;
        const mockedGenerateColorKey = 'KEY' as any;
        const handler = createDarkColorHandler(
            div,
            mockedGetDarkColor,
            mockedKnownColors,
            mockedGenerateColorKey
        );

        expect(handler.knownColors).toEqual(mockedKnownColors);
        expect(handler.getDarkColor).toBe(mockedGetDarkColor);
        expect(handler.generateColorKey).toBe(mockedGenerateColorKey);
    });
});

describe('DarkColorHandlerImpl.updateKnownColor', () => {
    it('light mode, with values', () => {
        const mockedDiv = {} as any;
        const handler = createDarkColorHandler(mockedDiv, null!);

        handler.updateKnownColor(false, 'aa', {
            lightModeColor: 'light',
            darkModeColor: 'dark',
        });

        expect(handler.knownColors).toEqual({
            aa: {
                lightModeColor: 'light',
                darkModeColor: 'dark',
            },
        });
    });

    it('light mode, without values, no original value', () => {
        const mockedDiv = {} as any;
        const handler = createDarkColorHandler(mockedDiv, null!);

        handler.updateKnownColor(false);

        expect(handler.knownColors).toEqual({});
    });

    it('light mode, without values, has original value', () => {
        const removePropertySpy = jasmine.createSpy('removeProperty');
        const mockedDiv = {
            style: {
                removeProperty: removePropertySpy,
            },
        } as any;
        const handler = createDarkColorHandler(mockedDiv, null!, {
            aa: {
                lightModeColor: 'light',
                darkModeColor: 'dark',
            },
        });

        handler.updateKnownColor(false);

        expect(handler.knownColors).toEqual({
            aa: {
                lightModeColor: 'light',
                darkModeColor: 'dark',
            },
        });
        expect(removePropertySpy).not.toHaveBeenCalled();
    });

    it('dark mode, with values', () => {
        const setPropertySpy = jasmine.createSpy('setProperty');
        const mockedDiv = {
            style: {
                setProperty: setPropertySpy,
            },
        } as any;
        const handler = createDarkColorHandler(mockedDiv, null!);

        handler.updateKnownColor(true, 'aa', {
            lightModeColor: 'light',
            darkModeColor: 'dark',
        });

        expect(handler.knownColors).toEqual({
            aa: {
                lightModeColor: 'light',
                darkModeColor: 'dark',
            },
        });
        expect(setPropertySpy).toHaveBeenCalledWith('aa', 'dark');
    });

    it('dark mode, without values, no original value', () => {
        const mockedDiv = {} as any;
        const handler = createDarkColorHandler(mockedDiv, null!);

        handler.updateKnownColor(true);

        expect(handler.knownColors).toEqual({});
    });

    it('dark mode, without values, has original value', () => {
        const setPropertySpy = jasmine.createSpy('setProperty');
        const mockedDiv = {
            style: {
                setProperty: setPropertySpy,
            },
        } as any;
        const handler = createDarkColorHandler(mockedDiv, null!, {
            aa: {
                lightModeColor: 'light',
                darkModeColor: 'dark',
            },
        });

        handler.updateKnownColor(true);

        expect(handler.knownColors).toEqual({
            aa: {
                lightModeColor: 'light',
                darkModeColor: 'dark',
            },
        });
        expect(setPropertySpy).toHaveBeenCalledWith('aa', 'dark');
    });
});
