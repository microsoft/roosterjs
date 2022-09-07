import getAutoBulletListStyle from '../../../../lib/plugins/ContentEdit/utils/getAutoBulletListStyle';
import { BulletListType } from 'roosterjs-editor-types';

describe('getAutoListStyle ', () => {
    function runTest(textBeforeCursor: string, listStyle: BulletListType) {
        const style = getAutoBulletListStyle(textBeforeCursor);
        expect(style).toEqual(listStyle);
    }

    it('=> ', () => {
        runTest('=> ', BulletListType.UnfilledArrow);
    });

    it('--> ', () => {
        runTest('--> ', BulletListType.DoubleLongArrow);
    });

    it('-> ', () => {
        runTest('-> ', BulletListType.LongArrow);
    });

    it('> ', () => {
        runTest('> ', BulletListType.ShortArrow);
    });

    it('-- ', () => {
        runTest('-- ', BulletListType.Square);
    });

    it('- ', () => {
        runTest('- ', BulletListType.Dash);
    });

    it('* ', () => {
        runTest('* ', BulletListType.Disc);
    });
});
