import { pasteTextColorFormatParser } from '../../lib/override/pasteTextColorFormatParser';

describe('pasteTextColorFormatParser', () => {
    it('Do not handle', () => {
        const element = document.createElement('div');
        element.style.color = 'var(--variable)';
        const format = {};
        const textColorSpy = jasmine.createSpy('defaultTextColorParser');

        pasteTextColorFormatParser(
            format,
            element,
            <any>{
                defaultFormatParsers: {
                    textColor: textColorSpy,
                },
            },
            <any>{}
        );

        expect(textColorSpy).not.toHaveBeenCalled();
    });

    it('Handle, name based color', () => {
        const element = document.createElement('div');
        element.style.color = 'white';
        const format = {};
        const textColorSpy = jasmine.createSpy('defaultTextColorParser');

        pasteTextColorFormatParser(
            format,
            element,
            <any>{
                defaultFormatParsers: {
                    textColor: textColorSpy,
                },
            },
            <any>{}
        );

        expect(textColorSpy).toHaveBeenCalled();
    });

    it('Handle, rgb color', () => {
        const element = document.createElement('div');
        element.style.color = 'rgb(77,77,77)';
        const format = {};
        const textColorSpy = jasmine.createSpy('defaultTextColorParser');

        pasteTextColorFormatParser(
            format,
            element,
            <any>{
                defaultFormatParsers: {
                    textColor: textColorSpy,
                },
            },
            <any>{}
        );

        expect(textColorSpy).toHaveBeenCalled();
    });

    it('Handle, rgb color', () => {
        const element = document.createElement('div');
        element.style.color = '#FFF';
        const format = {};
        const textColorSpy = jasmine.createSpy('defaultTextColorParser');

        pasteTextColorFormatParser(
            format,
            element,
            <any>{
                defaultFormatParsers: {
                    textColor: textColorSpy,
                },
            },
            <any>{}
        );

        expect(textColorSpy).toHaveBeenCalled();
    });
});
