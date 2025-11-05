import * as toggleBold from 'roosterjs-content-model-api/lib/publicApi/segment/toggleBold';
import * as toggleItalic from 'roosterjs-content-model-api/lib/publicApi/segment/toggleItalic';
import * as toggleUnderline from 'roosterjs-content-model-api/lib/publicApi/segment/toggleUnderline';
import { ShortcutBold, ShortcutItalic, ShortcutUnderline } from '../../lib/shortcut/shortcuts';
import type { IEditor } from 'roosterjs-content-model-types';

describe('shortcuts', () => {
    let mockedEditor: IEditor;

    beforeEach(() => {
        mockedEditor = ({} as any) as IEditor;
    });

    describe('ShortcutBold', () => {
        it('should have correct shortcut key configuration', () => {
            expect(ShortcutBold.shortcutKey.modifierKey).toBe('ctrl');
            expect(ShortcutBold.shortcutKey.shiftKey).toBe(false);
            expect(ShortcutBold.shortcutKey.which).toBe(66); // Keys.B
        });

        it('should call toggleBold with announceFormatChange when onClick is executed', () => {
            const toggleBoldSpy = spyOn(toggleBold, 'toggleBold');

            ShortcutBold.onClick(mockedEditor);

            expect(toggleBoldSpy).toHaveBeenCalledWith(mockedEditor, {
                announceFormatChange: true,
            });
        });

        it('should call toggleBold exactly once when onClick is executed', () => {
            const toggleBoldSpy = spyOn(toggleBold, 'toggleBold');

            ShortcutBold.onClick(mockedEditor);

            expect(toggleBoldSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('ShortcutItalic', () => {
        it('should have correct shortcut key configuration', () => {
            expect(ShortcutItalic.shortcutKey.modifierKey).toBe('ctrl');
            expect(ShortcutItalic.shortcutKey.shiftKey).toBe(false);
            expect(ShortcutItalic.shortcutKey.which).toBe(73); // Keys.I
        });

        it('should call toggleItalic with announceFormatChange when onClick is executed', () => {
            const toggleItalicSpy = spyOn(toggleItalic, 'toggleItalic');

            ShortcutItalic.onClick(mockedEditor);

            expect(toggleItalicSpy).toHaveBeenCalledWith(mockedEditor, {
                announceFormatChange: true,
            });
        });

        it('should call toggleItalic exactly once when onClick is executed', () => {
            const toggleItalicSpy = spyOn(toggleItalic, 'toggleItalic');

            ShortcutItalic.onClick(mockedEditor);

            expect(toggleItalicSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('ShortcutUnderline', () => {
        it('should have correct shortcut key configuration', () => {
            expect(ShortcutUnderline.shortcutKey.modifierKey).toBe('ctrl');
            expect(ShortcutUnderline.shortcutKey.shiftKey).toBe(false);
            expect(ShortcutUnderline.shortcutKey.which).toBe(85); // Keys.U
        });

        it('should call toggleUnderline with announceFormatChange when onClick is executed', () => {
            const toggleUnderlineSpy = spyOn(toggleUnderline, 'toggleUnderline');

            ShortcutUnderline.onClick(mockedEditor);

            expect(toggleUnderlineSpy).toHaveBeenCalledWith(mockedEditor, {
                announceFormatChange: true,
            });
        });

        it('should call toggleUnderline exactly once when onClick is executed', () => {
            const toggleUnderlineSpy = spyOn(toggleUnderline, 'toggleUnderline');

            ShortcutUnderline.onClick(mockedEditor);

            expect(toggleUnderlineSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('All formatting shortcuts', () => {
        it('should all use ctrl as modifier key', () => {
            expect(ShortcutBold.shortcutKey.modifierKey).toBe('ctrl');
            expect(ShortcutItalic.shortcutKey.modifierKey).toBe('ctrl');
            expect(ShortcutUnderline.shortcutKey.modifierKey).toBe('ctrl');
        });

        it('should all have shiftKey set to false', () => {
            expect(ShortcutBold.shortcutKey.shiftKey).toBe(false);
            expect(ShortcutItalic.shortcutKey.shiftKey).toBe(false);
            expect(ShortcutUnderline.shortcutKey.shiftKey).toBe(false);
        });

        it('should have unique key codes', () => {
            const keyCodes = [
                ShortcutBold.shortcutKey.which,
                ShortcutItalic.shortcutKey.which,
                ShortcutUnderline.shortcutKey.which,
            ];

            const uniqueKeyCodes = [...new Set(keyCodes)];
            expect(uniqueKeyCodes.length).toBe(keyCodes.length);
        });

        it('should all pass announceFormatChange: true to their respective toggle functions', () => {
            const toggleBoldSpy = spyOn(toggleBold, 'toggleBold');
            const toggleItalicSpy = spyOn(toggleItalic, 'toggleItalic');
            const toggleUnderlineSpy = spyOn(toggleUnderline, 'toggleUnderline');

            ShortcutBold.onClick(mockedEditor);
            ShortcutItalic.onClick(mockedEditor);
            ShortcutUnderline.onClick(mockedEditor);

            expect(toggleBoldSpy).toHaveBeenCalledWith(mockedEditor, {
                announceFormatChange: true,
            });
            expect(toggleItalicSpy).toHaveBeenCalledWith(mockedEditor, {
                announceFormatChange: true,
            });
            expect(toggleUnderlineSpy).toHaveBeenCalledWith(mockedEditor, {
                announceFormatChange: true,
            });
        });
    });
});
