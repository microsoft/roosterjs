import * as transformColor from 'roosterjs-content-model-dom/lib/domUtils/color/transformColor';
import { DarkColorHandler, EditorCore, Snapshot } from 'roosterjs-content-model-types';
import { restoreSnapshotColors } from '../../lib/utils/restoreSnapshotColors';

describe('restoreSnapshotColors', () => {
    let core: EditorCore;
    let updateKnownColorSpy: jasmine.Spy;
    let transformColorSpy: jasmine.Spy;
    let darkColorHandler: DarkColorHandler;
    const mockedDiv = 'DIV' as any;

    beforeEach(() => {
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');
        transformColorSpy = spyOn(transformColor, 'transformColor');
        darkColorHandler = {
            updateKnownColor: updateKnownColorSpy,
        } as any;

        core = {
            physicalRoot: mockedDiv,
            logicalRoot: mockedDiv,
            lifecycle: {
                isDarkMode: false,
            },
            darkColorHandler,
        } as any;
    });

    it('No known colors, from light mode to light mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: false,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
        expect(transformColorSpy).not.toHaveBeenCalled();
    });

    it('No known colors, from light mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: false,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(updateKnownColorSpy).toHaveBeenCalledWith(true);
        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            mockedDiv,
            false,
            'lightToDark',
            darkColorHandler
        );
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            isDarkMode: true,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(updateKnownColorSpy).toHaveBeenCalledWith(true);
        expect(transformColorSpy).not.toHaveBeenCalled();
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
            darkColorHandler
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false);
    });
});
