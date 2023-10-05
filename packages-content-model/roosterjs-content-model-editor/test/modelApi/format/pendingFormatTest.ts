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
        const mockedContainer = 'C' as any;
        const mockedOffset = 'O' as any;

        setPendingFormat(editor, mockedFormat, mockedContainer, mockedOffset);

        expect((editor as any).core.lifecycle.customData.__ContentModelPendingFormat.value).toEqual(
            {
                format: mockedFormat,
                posContainer: mockedContainer,
                posOffset: mockedOffset,
            }
        );
    });
});

describe('pendingFormat.clearPendingFormat', () => {
    it('clear format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;
        const mockedContainer = 'C' as any;
        const mockedOffset = 'O' as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                posContainer: mockedContainer,
                posOffset: mockedOffset,
            },
        };

        clearPendingFormat(editor);

        expect((editor as any).core.lifecycle.customData.__ContentModelPendingFormat.value).toEqual(
            {
                format: null,
                posContainer: null,
                posOffset: null,
            }
        );
    });
});

describe('pendingFormat.canApplyPendingFormat', () => {
    it('can apply format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFormat = 'FORMAT' as any;

        const mockedContainer = 'C' as any;
        const mockedOffset = 'O' as any;

        editor.getFocusedPosition = () => ({ node: mockedContainer, offset: mockedOffset } as any);

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                posContainer: mockedContainer,
                posOffset: mockedOffset,
            },
        };

        const result = canApplyPendingFormat(editor);

        expect(result).toBeTrue();
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
        const mockedContainer1 = 'C1';
        const mockedContainer2 = 'C2';

        const mockedPosition2 = {
            node: mockedContainer2,
            offset: 1,
        };

        editor.getFocusedPosition = () => mockedPosition2 as any;

        (editor as any).core.lifecycle.customData.__ContentModelPendingFormat = {
            value: {
                format: mockedFormat,
                posContainer: mockedContainer1,
                posOffset: 0,
            },
        };

        const result = canApplyPendingFormat(editor);

        expect(result).toBeFalse();
    });
});
