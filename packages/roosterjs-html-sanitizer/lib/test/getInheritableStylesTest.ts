import getInheritableStyles from '../utils/getInheritableStyles';

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
        node.style.fontFamily = '"Times New Roman"';
        let styles = getInheritableStyles(node);
        document.body.removeChild(node);

        const expectedResult: any = {
            ['border-spacing']: '0px 0px',
            ['caption-side']: 'top',
            color: 'rgb(0, 0, 0)',
            cursor: 'auto',
            direction: 'ltr',
            ['empty-cells']: 'show',
            ['font-family']: '"Times New Roman"',
            ['font-size']: '16px',
            ['font-style']: 'normal',
            ['font-variant']: 'normal',
            ['font-weight']: '400',
            font: 'normal normal 400 normal 16px / normal "Times New Roman"',
            ['letter-spacing']: 'normal',
            ['line-height']: 'normal',
            ['list-style-image']: 'none',
            ['list-style-position']: 'outside',
            ['list-style-type']: 'disc',
            ['list-style']: 'disc outside none',
            orphans: '2',
            quotes: '',
            ['text-align']: 'start',
            ['text-indent']: '0px',
            ['text-transform']: 'none',
            visibility: 'visible',
            ['white-space']: 'normal',
            widows: '2',
            ['word-spacing']: '0px',
        };
        Object.keys(styles).forEach(key => {
            const value = styles[key];

            // The "font" style can be changed in different versions of Chrome, so skip compare it
            if (key != 'font') {
                expect(sort(value)).toEqual(sort(expectedResult[key]), key);
            }
        });
    });
});

function sort(str: string) {
    return str.split(' ').sort().join(' ');
}
