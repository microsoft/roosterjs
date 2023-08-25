import { deprecatedBorderColorParser } from '../../../../lib/editor/plugins/PastePlugin/utils/deprecatedColorParser';

const DeprecatedColors: string[] = [
    'inactiveborder',
    'activeborder',
    'inactivecaptiontext',
    'inactivecaption',
    'activecaption',
    'appworkspace',
    'infobackground',
    'background',
    'buttonhighlight',
    'buttonshadow',
    'captiontext',
    'infotext',
    'menutext',
    'menu',
    'scrollbar',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedfhadow',
    'windowtext',
    'windowframe',
    'window',
];

describe('deprecateColorParserTests |', () => {
    DeprecatedColors.forEach(color => {
        it('Remove ' + color + ' in borderTop', () => {
            const format = { borderTop: '1pt solid ' + color };
            deprecatedBorderColorParser(format, <any>null, <any>null, <any>null);

            expect(format).toEqual({
                borderTop: '1pt solid',
            });
        });

        it('Remove ' + color + ' in borderTopColor', () => {
            const format = { borderTopColor: color };
            deprecatedBorderColorParser(format, <any>null, <any>null, <any>null);

            expect(format).toEqual({
                borderTopColor: '',
            });
        });
    });
});
