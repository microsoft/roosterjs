import * as transformColor from '../../lib/publicApi/color/transformColor';
import { restoreSnapshotColors } from '../../lib/utils/restoreSnapshotColors';
import { Snapshot, SnapshotsManager, StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('restoreSnapshotColors', () => {
    let core: StandaloneEditorCore;
    let transformColorSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;
    let mockedSnapshotsManager: SnapshotsManager;
    const mockedDiv = 'DIV' as any;

    beforeEach(() => {
        transformColorSpy = spyOn(transformColor, 'transformColor');
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');
        mockedSnapshotsManager = {
            updateKnownColor: updateKnownColorSpy,
        } as any;

        core = {
            lifecycle: {
                isDarkMode: false,
            },
            contentDiv: mockedDiv,
            undo: {
                snapshotsManager: mockedSnapshotsManager,
            },
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
            mockedSnapshotsManager
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
            mockedSnapshotsManager
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });
});
