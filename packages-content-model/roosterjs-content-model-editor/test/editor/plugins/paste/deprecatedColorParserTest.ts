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

describe('deprecateColorParserTests |', () => {
    DeprecatedColors.forEach(color => {
        it('Remove ' + color + ' in borderTop', () => {
            const format = { borderTop: '1pt solid ' + color };

            deprecatedBorderColorParser(format, <any>null, <any>null, <any>null);

            expect(format).toEqual({
                borderTop: '1pt solid',
            });
        });
    });
});
