import { BulletListType } from '../../../lib/constants/BulletListType';
import { getAutoListStyleType } from '../../../lib/modelApi/list/getAutoListStyleType';
import { NumberingListType } from '../../../lib/constants/NumberingListType';

describe('getAutoListStyleType', () => {
    it('ul, no styleType, no auto apply, no existing style', () => {
        expect(getAutoListStyleType('UL', {}, 0)).toBe(undefined);
        expect(getAutoListStyleType('UL', {}, 1)).toBe(undefined);
        expect(getAutoListStyleType('UL', {}, 2)).toBe(undefined);
    });

    it('ul, no styleType, no auto apply, has existing style', () => {
        expect(getAutoListStyleType('UL', {}, 0, 'disc')).toBe(BulletListType.Disc);
        expect(getAutoListStyleType('UL', {}, 0, 'circle')).toBe(BulletListType.Circle);
        expect(getAutoListStyleType('UL', {}, 0, 'square')).toBe(BulletListType.Square);
        expect(getAutoListStyleType('UL', {}, 0, 'other')).toBe(undefined);
    });

    it('ul, no styleType, has auto apply', () => {
        expect(getAutoListStyleType('UL', { applyListStyleFromLevel: true }, 0)).toBe(
            BulletListType.Disc
        );
        expect(getAutoListStyleType('UL', { applyListStyleFromLevel: true }, 1)).toBe(
            BulletListType.Circle
        );
        expect(getAutoListStyleType('UL', { applyListStyleFromLevel: true }, 2)).toBe(
            BulletListType.Square
        );
        expect(getAutoListStyleType('UL', { applyListStyleFromLevel: true }, 3)).toBe(
            BulletListType.Disc
        );
        expect(getAutoListStyleType('UL', { applyListStyleFromLevel: true }, 2, 'other')).toBe(
            BulletListType.Square
        );
    });

    it('ul, has styleType', () => {
        expect(getAutoListStyleType('UL', { unorderedStyleType: BulletListType.Circle }, 0)).toBe(
            BulletListType.Circle
        );
        expect(getAutoListStyleType('UL', { unorderedStyleType: BulletListType.Dash }, 0)).toBe(
            BulletListType.Dash
        );
        expect(
            getAutoListStyleType('UL', { unorderedStyleType: BulletListType.LongArrow }, 0)
        ).toBe(BulletListType.LongArrow);

        expect(
            getAutoListStyleType(
                'UL',
                { unorderedStyleType: BulletListType.LongArrow, applyListStyleFromLevel: true },
                2
            )
        ).toBe(BulletListType.LongArrow);
    });

    it('ol, no styleType, no auto apply, no existing style', () => {
        expect(getAutoListStyleType('OL', {}, 0)).toBe(undefined);
        expect(getAutoListStyleType('OL', {}, 1)).toBe(undefined);
        expect(getAutoListStyleType('OL', {}, 2)).toBe(undefined);
    });

    it('ol, no styleType, no auto apply, has existing style', () => {
        expect(getAutoListStyleType('OL', {}, 0, 'lower-alpha')).toBe(NumberingListType.LowerAlpha);
        expect(getAutoListStyleType('OL', {}, 0, 'lower-latin')).toBe(NumberingListType.LowerAlpha);
        expect(getAutoListStyleType('OL', {}, 0, 'upper-alpha')).toBe(NumberingListType.UpperAlpha);
        expect(getAutoListStyleType('OL', {}, 0, 'upper-latin')).toBe(NumberingListType.UpperAlpha);
        expect(getAutoListStyleType('OL', {}, 0, 'lower-roman')).toBe(NumberingListType.LowerRoman);
        expect(getAutoListStyleType('OL', {}, 0, 'upper-roman')).toBe(NumberingListType.UpperRoman);
        expect(getAutoListStyleType('OL', {}, 0, 'other')).toBe(undefined);
    });

    it('ol, no styleType, has auto apply', () => {
        expect(getAutoListStyleType('OL', { applyListStyleFromLevel: true }, 0)).toBe(
            NumberingListType.Decimal
        );
        expect(getAutoListStyleType('OL', { applyListStyleFromLevel: true }, 1)).toBe(
            NumberingListType.LowerAlpha
        );
        expect(getAutoListStyleType('OL', { applyListStyleFromLevel: true }, 2)).toBe(
            NumberingListType.LowerRoman
        );
        expect(getAutoListStyleType('OL', { applyListStyleFromLevel: true }, 3)).toBe(
            NumberingListType.Decimal
        );
        expect(getAutoListStyleType('OL', { applyListStyleFromLevel: true }, 2, 'other')).toBe(
            NumberingListType.LowerRoman
        );
    });

    it('ol, has styleType', () => {
        expect(
            getAutoListStyleType('OL', { orderedStyleType: NumberingListType.LowerAlphaDash }, 0)
        ).toBe(NumberingListType.LowerAlphaDash);
        expect(
            getAutoListStyleType('OL', { orderedStyleType: NumberingListType.LowerAlpha }, 0)
        ).toBe(NumberingListType.LowerAlpha);
        expect(
            getAutoListStyleType(
                'OL',
                { orderedStyleType: NumberingListType.LowerRomanParenthesis },
                0
            )
        ).toBe(NumberingListType.LowerRomanParenthesis);

        expect(
            getAutoListStyleType(
                'OL',
                {
                    orderedStyleType: NumberingListType.LowerRomanParenthesis,
                    applyListStyleFromLevel: true,
                },
                2
            )
        ).toBe(NumberingListType.LowerRomanParenthesis);
    });
});
