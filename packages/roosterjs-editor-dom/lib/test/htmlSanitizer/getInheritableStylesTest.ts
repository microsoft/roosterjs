import getInheritableStyles from '../../htmlSanitizer/getInheritableStyles';

describe('getInheritableStyles', () => {
    it('NULL', () => {
        let styles = getInheritableStyles(null);
        expect(styles).toEqual({
            ['border-spacing']: '',
            ['caption-side']: '',
            color: '',
            cursor: '',
            direction: '',
            ['empty-cells']: '',
            ['font-family']: '',
            ['font-size']: '',
            ['font-style']: '',
            ['font-variant']: '',
            ['font-weight']: '',
            font: '',
            ['letter-spacing']: '',
            ['line-height']: '',
            ['list-style-image']: '',
            ['list-style-position']: '',
            ['list-style-type']: '',
            ['list-style']: '',
            orphans: '',
            quotes: '',
            ['text-align']: '',
            ['text-indent']: '',
            ['text-transform']: '',
            visibility: '',
            ['white-space']: '',
            widows: '',
            ['word-spacing']: '',
        });
    });

    it('Element', () => {
        let node = document.createElement('SPAN');
        document.body.appendChild(node);
        node.style.fontFamily = 'arial';
        let styles = getInheritableStyles(node);
        document.body.removeChild(node);

        const expectedResult: any = {
            ['border-spacing']: '0px 0px',
            ['caption-side']: 'top',
            color: 'rgb(0, 0, 0)',
            cursor: 'auto',
            direction: 'ltr',
            ['empty-cells']: 'show',
            ['font-family']: 'arial',
            ['font-size']: '16px',
            ['font-style']: 'normal',
            ['font-variant']: 'normal',
            ['font-weight']: '400',
            ['letter-spacing']: 'normal',
            ['line-height']: 'normal',
            ['list-style-image']: 'none',
            ['list-style-position']: 'outside',
            ['list-style-type']: 'disc',
            ['text-align']: 'start',
            ['text-indent']: '0px',
            ['text-transform']: 'none',
            visibility: 'visible',
            ['white-space']: 'normal',
            ['word-spacing']: '0px',

            // These styles can have variable values among browsers and versions, so we ignore them
            font: undefined,
            orphans: undefined,
            widows: undefined,
            ['list-style']: undefined,
            quotes: undefined,
        };
        Object.keys(styles).forEach(key => {
            const value = styles[key];
            const expectedValue = expectedResult[key];

            if (expectedValue !== undefined) {
                expect(sort(value)).toEqual(sort(expectedResult[key]), key);
            }
        });
    });
});

function sort(str: string) {
    return str.split(' ').sort().join(' ');
}
