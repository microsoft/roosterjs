import * as roosterEditorApi from 'roosterjs-editor-api';
import * as roosterEditorDom from 'roosterjs-editor-dom';
import * as TestHelper from 'roosterjs-editor-api/test/TestHelper';
import { DocumentCommand, FontSizeChange, IEditor } from 'roosterjs-editor-types';
import { ShortcutFeatures } from '../../../lib/plugins/ContentEdit/features/shortcutFeatures';

let editor: IEditor;
const TEST_ID = 'shortcutTest';

beforeEach(() => {
    editor = TestHelper.initEditor(TEST_ID);
});

afterEach(() => {
    editor.dispose();
    TestHelper.removeElement(TEST_ID);
});

const spyOnFunction = <T>(obj: T, func: keyof T) => {
    const spy = jasmine.createSpy(func as string);
    Object.defineProperty(obj, func, { value: spy });
    return spy;
};

it('default shortcut handler calls cached command action', () => {
    const command = {
        action: jasmine.createSpy(),
        rawEvent: {
            preventDefault: jasmine.createSpy(),
            stopPropagation: jasmine.createSpy(),
        },
    };
    const cacheGetEventDataSpy = jasmine.createSpy();
    cacheGetEventDataSpy.and.returnValue(command);
    const saveImpl: any = (roosterEditorDom as any).cacheGetEventData;
    Object.defineProperty(roosterEditorDom, 'cacheGetEventData', { value: cacheGetEventDataSpy });
    const shortCutFeature = ShortcutFeatures.defaultShortcut;
    const rawEvent = new KeyboardEvent('down', null);
    const preventDefaultSpy = spyOn(rawEvent, 'preventDefault');
    const stopPropagationSpy = spyOn(rawEvent, 'stopPropagation');
    const event = {
        rawEvent,
        eventType: 2,
    };
    shortCutFeature.handleEvent(event, editor);
    expect(command.action).toHaveBeenCalledTimes(1);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    Object.defineProperty(roosterEditorDom, 'cacheGetEventData', { value: saveImpl });
});

const parameters = [
    {
        description:
            'default shortcut calls the toogleItalic command on the editor when typing CTLR+I',
        key: 73,
        command: DocumentCommand.Italic,
    },
    {
        description:
            'default shortcut calls the toggleBold command on the editor when typing CTLR+b',
        key: 66,
        command: DocumentCommand.Bold,
    },
    {
        description:
            'default shortcut calls the toggleUnderline command on the editor when typing CTLR+u',
        key: 85,
        command: DocumentCommand.Underline,
    },
    {
        description:
            'default shortcut calls the clearFormat command on the editor when typing CTLR+Space',
        key: 32,
        command: DocumentCommand.RemoveFormat,
    },
];

parameters.forEach(({ description, key, command }) => {
    it(description, () => {
        const rawEvent = new KeyboardEvent('keydown', {
            ctrlKey: true,
        });
        Object.defineProperty(rawEvent, 'which', {
            get: () => key,
        });
        const event = {
            rawEvent,
            eventType: 0,
        };
        const shortCutFeature = ShortcutFeatures.defaultShortcut;
        const spya = spyOn(editor.getDocument(), 'execCommand');
        shortCutFeature.handleEvent(event, editor);
        expect(spya).toHaveBeenCalledWith(command, false, undefined);
    });
});

[
    { key: 90, mod: 'ctrl', keyCombo: 'Ctrl+Z' },
    { key: 8, mod: 'alt', keyCombo: 'Alt+Backspace' },
].forEach(({ key, mod, keyCombo }) => {
    it(`default shortcut calls the undo command on the editor when typing ${keyCombo}`, () => {
        const rawEvent = new KeyboardEvent('keydown', {
            [`${mod}Key`]: true,
        });
        Object.defineProperty(rawEvent, 'which', {
            get: () => key,
        });
        const event = {
            rawEvent,
            eventType: 0,
        };

        const shortCutFeature = ShortcutFeatures.defaultShortcut;
        const spyUndo = spyOn(editor, 'undo');
        shortCutFeature.handleEvent(event, editor);
        expect(spyUndo).toHaveBeenCalled();
    });
});

it('default shortcut calls the redo command on the editor when typing CTRL+Y', () => {
    const rawEvent = new KeyboardEvent('keydown', {
        ctrlKey: true,
    });
    Object.defineProperty(rawEvent, 'which', {
        get: () => 89,
    });
    const event = {
        rawEvent,
        eventType: 0,
    };
    const shortCutFeature = ShortcutFeatures.defaultShortcut;
    const spyUndo = spyOnFunction(editor, 'redo');
    shortCutFeature.handleEvent(event, editor);
    expect(spyUndo).toHaveBeenCalled();
});

it('default shortcut calls the changeFontSize increase when typing CTRL+SHiFT+.', () => {
    const changeFontSizeSpy = spyOnFunction(roosterEditorApi, 'changeFontSize');

    const rawEvent = new KeyboardEvent('keydown', {
        ctrlKey: true,
        shiftKey: true,
    });
    Object.defineProperty(rawEvent, 'which', {
        get: () => 190,
    });
    const event = {
        rawEvent,
        eventType: 0,
    };
    const shortCutFeature = ShortcutFeatures.defaultShortcut;
    shortCutFeature.handleEvent(event, editor);
    expect(changeFontSizeSpy).toHaveBeenCalledWith(editor, FontSizeChange.Increase);
});

it('default shortcut calls the changeFontSize increase when typing CTRL+SHiFT+, ', () => {
    const changeFontSizeSpy = spyOnFunction(roosterEditorApi, 'changeFontSize');
    const rawEvent = new KeyboardEvent('keydown', {
        ctrlKey: true,
        shiftKey: true,
    });
    Object.defineProperty(rawEvent, 'which', {
        get: () => 188,
    });
    const event = {
        rawEvent,
        eventType: 0,
    };
    const shortCutFeature = ShortcutFeatures.defaultShortcut;
    shortCutFeature.handleEvent(event, editor);
    expect(changeFontSizeSpy).toHaveBeenCalledWith(editor, FontSizeChange.Decrease);
});
