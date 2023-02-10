import ContentModelEditor from '../../../lib/editor/ContentModelEditor';
import {
    canApplyPendingFormat,
    clearPendingFormat,
    getPendingFormat,
    setPendingFormat,
} from '../../../lib/modelApi/format/pendingFormat';

describe('pendingFormat.getPendingFormat', () => {
    it('no format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const format = getPendingFormat(editor);

        expect(format).toBeNull();
    });

    it('has format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
            },
        };

        const format = getPendingFormat(editor);

        expect(format).toBe(mockedFormat);
    });
});

describe('pendingFormat.setPendingFormat', () => {
    it('set format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;
        const mockedPosition = 'POSITION' as any;

        setPendingFormat(editor, mockedFormat, mockedPosition);

        expect((editor as any).core.lifecycle.customData.__ContentModelPendingFormat.value).toEqual(
            {
                format: mockedFormat,
                position: mockedPosition,
            }
        );
    });
});

describe('pendingFormat.clearPendingFormat', () => {
    it('clear format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;
        const mockedPosition = 'POSITION' as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                position: mockedPosition,
            },
        };

        clearPendingFormat(editor);

        expect((editor as any).core.lifecycle.customData.__ContentModelPendingFormat.value).toEqual(
            {
                format: null,
                position: null,
            }
        );
    });
});

describe('pendingFormat.canApplyPendingFormat', () => {
    it('can apply format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;
        const mockedPosition = 'POSITION' as any;

        const equalTo = jasmine.createSpy('equalto').and.returnValue(true);
        const mockedPosition2 = {
            equalTo,
        };

        editor.getFocusedPosition = () => mockedPosition2 as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                position: mockedPosition,
            },
        };

        const result = canApplyPendingFormat(editor);

        expect(result).toBeTrue();
        expect(equalTo).toHaveBeenCalledWith(mockedPosition);
    });

    it('no pending format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        const equalTo = jasmine.createSpy('equalto').and.returnValue(true);
        const mockedPosition2 = {
            equalTo,
        };

        editor.getFocusedPosition = () => mockedPosition2 as any;

        const result = canApplyPendingFormat(editor);

        expect(result).toBeFalse();
        expect(equalTo).not.toHaveBeenCalled();
    });

    it('no current position', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;
        const mockedPosition = 'POSITION' as any;

        const equalTo = jasmine.createSpy('equalto').and.returnValue(true);

        editor.getFocusedPosition = () => null as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                position: mockedPosition,
            },
        };

        const result = canApplyPendingFormat(editor);

        expect(result).toBeFalse();
        expect(equalTo).not.toHaveBeenCalledWith();
    });

    it('position is not the same', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;
        const mockedPosition = 'POSITION' as any;

        const equalTo = jasmine.createSpy('equalto').and.returnValue(false);
        const mockedPosition2 = {
            equalTo,
        };

        editor.getFocusedPosition = () => mockedPosition2 as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                position: mockedPosition,
            },
        };

        const result = canApplyPendingFormat(editor);

        expect(result).toBeFalse();
        expect(equalTo).toHaveBeenCalledWith(mockedPosition);
    });
});
