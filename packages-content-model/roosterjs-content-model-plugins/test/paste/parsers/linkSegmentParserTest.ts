import { linkSegmentParser } from '../../../lib/paste/utils/parsers/linkSegmentParser';

describe('linkSegmentParser |', () => {
    it('set text color 1', () => {
        const a = document.createElement('a');
        const format: any = {};

        linkSegmentParser(format, a, <any>{}, <any>{});

        expect(format).toEqual({ textColor: 'rgb(0, 0, 238)' });
    });

    it('set text color 2', () => {
        const a = document.createElement('a');
        a.style.color = 'var(--noExistingVar)';
        const format: any = {};

        linkSegmentParser(format, a, <any>{}, <any>{});

        expect(format).toEqual({ textColor: 'rgb(0, 0, 238)' });
    });

    it('dont set text color 1', () => {
        const a = document.createElement('a');
        const format: any = { textColor: 'white' };

        linkSegmentParser(format, a, <any>{}, <any>{});

        expect(format).toEqual({ textColor: 'white' });
    });

    it('dont set text color 2', () => {
        const a = document.createElement('a');
        a.style.color = 'var(--noExistingVar)';
        const format: any = { textColor: 'white' };

        linkSegmentParser(format, a, <any>{}, <any>{});

        expect(format).toEqual({ textColor: 'white' });
    });

    it('dont set text color 3', () => {
        const a = document.createElement('a');
        a.href = 'www.bing.com';
        a.style.color = 'var(--noExistingVar)';
        const format: any = { textColor: 'white' };

        linkSegmentParser(format, a, <any>{}, <any>{});

        expect(format).toEqual({ textColor: 'white' });
    });
});
