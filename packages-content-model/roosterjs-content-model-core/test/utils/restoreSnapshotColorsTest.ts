import * as transformColor from '../../lib/publicApi/color/transformColor';
import { restoreSnapshotColors } from '../../lib/utils/restoreSnapshotColors';
import { Snapshot, StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('restoreSnapshotColors', () => {
    let core: StandaloneEditorCore;
    let registerColorSpy: jasmine.Spy;
    let transformColorSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;
    const mockedDiv = 'DIV' as any;

    beforeEach(() => {
        registerColorSpy = jasmine.createSpy('registerColor');
        transformColorSpy = spyOn(transformColor, 'transformColor');
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');

        core = {
            lifecycle: {},
            contentDiv: mockedDiv,
            undo: {
                snapshotsManager: {
                    updateKnownColor: updateKnownColorSpy,
                },
            },
        } as any;
    });

    it('No known colors, from light mode to light mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: false,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
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

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(mockedDiv, false, 'lightToDark');
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: true,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).not.toHaveBeenCalled();
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: true,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(mockedDiv, false, 'darkToLight');
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });
});
