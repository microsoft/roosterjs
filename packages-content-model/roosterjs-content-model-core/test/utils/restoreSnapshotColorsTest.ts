import { ColorTransformDirection } from 'roosterjs-editor-types';
import { restoreSnapshotColors } from '../../lib/utils/restoreSnapshotColors';
import { Snapshot, StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('restoreSnapshotColors', () => {
    let core: StandaloneEditorCore;
    let registerColorSpy: jasmine.Spy;
    let transformColorSpy: jasmine.Spy;
    const mockedDiv = 'DIV' as any;

    beforeEach(() => {
        registerColorSpy = jasmine.createSpy('registerColor');
        transformColorSpy = jasmine.createSpy('transformColor');

        core = {
            lifecycle: {},
            contentDiv: mockedDiv,
            darkColorHandler: {
                registerColor: registerColorSpy,
            },
            api: {
                transformColor: transformColorSpy,
            },
        } as any;
    });

    it('No known colors, from light mode to light mode', () => {
        const snapshot: Snapshot = {
            knownColors: [],
            isDarkMode: false,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).not.toHaveBeenCalled();
    });

    it('No known colors, from light mode to dark mode', () => {
        const snapshot: Snapshot = {
            knownColors: [],
            isDarkMode: false,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            core,
            mockedDiv,
            false,
            null,
            ColorTransformDirection.LightToDark,
            true,
            false
        );
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            knownColors: [],
            isDarkMode: true,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).not.toHaveBeenCalled();
    });

    it('No known colors, from dark mode to dark mode', () => {
        const snapshot: Snapshot = {
            knownColors: [],
            isDarkMode: true,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).not.toHaveBeenCalled();
        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            core,
            mockedDiv,
            false,
            null,
            ColorTransformDirection.DarkToLight,
            true,
            true
        );
    });

    it('Has known colors, from light mode to light mode', () => {
        const lightColor1 = 'L1';
        const lightColor2 = 'L2';
        const darkColor1 = 'D1';
        const darkColor2 = 'D2';
        const snapshot: Snapshot = {
            knownColors: [
                {
                    lightModeColor: lightColor1,
                    darkModeColor: darkColor1,
                },
                {
                    lightModeColor: lightColor2,
                    darkModeColor: darkColor2,
                },
            ],
            isDarkMode: false,
            html: 'test',
        };

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).toHaveBeenCalledTimes(2);
        expect(registerColorSpy).toHaveBeenCalledWith(lightColor1, undefined, darkColor1);
        expect(registerColorSpy).toHaveBeenCalledWith(lightColor2, undefined, darkColor2);

        expect(transformColorSpy).toHaveBeenCalledTimes(0);
    });

    it('Has known colors, from light mode to dark mode', () => {
        const lightColor1 = 'L1';
        const lightColor2 = 'L2';
        const darkColor1 = 'D1';
        const darkColor2 = 'D2';
        const snapshot: Snapshot = {
            knownColors: [
                {
                    lightModeColor: lightColor1,
                    darkModeColor: darkColor1,
                },
                {
                    lightModeColor: lightColor2,
                    darkModeColor: darkColor2,
                },
            ],
            isDarkMode: false,
            html: 'test',
        };

        core.lifecycle.isDarkMode = true;

        restoreSnapshotColors(core, snapshot);

        expect(registerColorSpy).toHaveBeenCalledTimes(2);
        expect(registerColorSpy).toHaveBeenCalledWith(lightColor1, true, darkColor1);
        expect(registerColorSpy).toHaveBeenCalledWith(lightColor2, true, darkColor2);

        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            core,
            mockedDiv,
            false,
            null,
            ColorTransformDirection.LightToDark,
            true,
            false
        );
    });
});
