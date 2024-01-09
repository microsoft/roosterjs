import * as transformColor from '../../lib/publicApi/color/transformColor';
import { ColorManager, Snapshot, StandaloneEditorCore } from 'roosterjs-content-model-types';
import { restoreSnapshotColors } from '../../lib/utils/restoreSnapshotColors';

describe('restoreSnapshotColors', () => {
    let core: StandaloneEditorCore;
    let transformColorSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;
    let mockedColorManager: ColorManager;
    const mockedDiv = 'DIV' as any;

    beforeEach(() => {
        transformColorSpy = spyOn(transformColor, 'transformColor');
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');
        mockedColorManager = {
            updateKnownColor: updateKnownColorSpy,
        } as any;

        core = {
            lifecycle: {
                isDarkMode: false,
            },
            contentDiv: mockedDiv,
            colorManager: mockedColorManager,
        } as any;
    });

    it('No known colors, from light mode to light mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: false,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(transformColorSpy).not.toHaveBeenCalled();
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });

    it('No known colors, from light mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: false,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            mockedDiv,
            false,
            'lightToDark',
            mockedColorManager
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true);
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: true,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(transformColorSpy).not.toHaveBeenCalled();
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true);
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: true,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            mockedDiv,
            false,
            'darkToLight',
            mockedColorManager
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });
});
