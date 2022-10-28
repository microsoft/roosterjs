import setBulletListMarkers from '../../lib/list/setBulletListMarkers';
import { BulletListType } from 'roosterjs-editor-types';

describe('setBulletListMarkers', () => {
    function runTest(bulletType: BulletListType, expectedStyle: string) {
        const li = document.createElement('li');
        document.body.appendChild(li);
        setBulletListMarkers(li, bulletType);
        expect(li.style.listStyleType).toBe(expectedStyle);
        document.body.removeChild(li);
    }

    it('disc', () => {
        runTest(BulletListType.Disc, 'disc');
    });

    it('square', () => {
        runTest(BulletListType.Square, '"∎ "');
    });

    it('dash', () => {
        runTest(BulletListType.Dash, '"- "');
    });

    it('long arrow', () => {
        runTest(BulletListType.LongArrow, '"➔ "');
    });

    it('double long arrow', () => {
        runTest(BulletListType.DoubleLongArrow, '"➔ "');
    });

    it('short arrow', () => {
        runTest(BulletListType.ShortArrow, '"➢ "');
    });

    it('Unfilled arrow', () => {
        runTest(BulletListType.UnfilledArrow, '"➪ "');
    });

    it('Hyphen', () => {
        runTest(BulletListType.Hyphen, '"— "');
    });
});
