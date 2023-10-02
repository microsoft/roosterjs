import { deprecatedBorderColorParser } from '../../../../lib/editor/plugins/PastePlugin/utils/deprecatedColorParser';

const DeprecatedColors: string[] = [
    'activeborder',
    'activecaption',
    'appworkspace',
    'background',
    'buttonhighlight',
    'buttonshadow',
    'captiontext',
    'inactiveborder',
    'inactivecaption',
    'inactivecaptiontext',
    'infobackground',
    'infotext',
    'menu',
    'menutext',
    'scrollbar',
    'threeddarkshadow',
    'threedface',
    'threedfhadow',
    'threedhighlight',
    'threedlightshadow',
    'window',
    'windowframe',
    'windowtext',
];

const WHITE_COLOR = '#FFFFFF';
const BLACK_COLOR = '#000000';

describe('deprecateColorParserTests |', () => {
    DeprecatedColors.forEach(color => {
        it('Remove ' + color + ' in borderTop | Dark Mode', () => {
            const format = { borderTop: '1pt solid ' + color };

            deprecatedBorderColorParser(format, <any>null, <any>{ isDarkMode: true }, <any>null);

            expect(format).toEqual({
                borderTop: '1pt solid ' + WHITE_COLOR,
            });
        });

        it('Remove ' + color + ' in borderTop | Light Mode', () => {
            const format = { borderTop: '1pt solid ' + color };

            deprecatedBorderColorParser(format, <any>null, <any>{ isDarkMode: false }, <any>null);

            expect(format).toEqual({
                borderTop: '1pt solid ' + BLACK_COLOR,
            });
        });
    });
});
