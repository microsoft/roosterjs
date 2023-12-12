import { IStandaloneEditor, SnapshotsManager } from 'roosterjs-content-model-types';
import { undo } from '../../../lib/publicApi/undo/undo';

describe('undo', () => {
    let editor: IStandaloneEditor;
    let getSnapshotsManagerSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;
    let restoreSnapshotSpy: jasmine.Spy;
    let focusSpy: jasmine.Spy;
    let moveSpy: jasmine.Spy;
    let mockedSnapshotsManager: SnapshotsManager;

    beforeEach(() => {
        moveSpy = jasmine.createSpy('move');
        mockedSnapshotsManager = {
            move: moveSpy,
        } as any;
        getSnapshotsManagerSpy = jasmine
            .createSpy('getSnapshotsManager')
            .and.returnValue(mockedSnapshotsManager);

        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
        restoreSnapshotSpy = jasmine.createSpy('restoreSnapshot');
        focusSpy = jasmine.createSpy('focus');

        editor = {
            getSnapshotsManager: getSnapshotsManagerSpy,
            takeSnapshot: takeSnapshotSpy,
            restoreSnapshot: restoreSnapshotSpy,
            focus: focusSpy,
        } as any;
    });

    it('Nothing to undo', () => {
        mockedSnapshotsManager.hasNewContent = false;
        moveSpy.and.returnValue(null);

        undo(editor);

        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(getSnapshotsManagerSpy).toHaveBeenCalledTimes(1);
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
        expect(moveSpy).toHaveBeenCalledTimes(1);
        expect(moveSpy).toHaveBeenCalledWith(-1);
        expect(restoreSnapshotSpy).toHaveBeenCalledTimes(0);
    });

    it('Nothing to undo, hasNewContent', () => {
        mockedSnapshotsManager.hasNewContent = true;
        moveSpy.and.returnValue(null);

        undo(editor);

        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(getSnapshotsManagerSpy).toHaveBeenCalledTimes(1);
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(moveSpy).toHaveBeenCalledTimes(1);
        expect(moveSpy).toHaveBeenCalledWith(-1);
        expect(restoreSnapshotSpy).toHaveBeenCalledTimes(0);
    });

    it('Has snapshot to undo', () => {
        mockedSnapshotsManager.hasNewContent = false;

        const mockedSnapshot = 'SNAPSHOT' as any;
        moveSpy.and.returnValue(mockedSnapshot);

        undo(editor);

        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(getSnapshotsManagerSpy).toHaveBeenCalledTimes(1);
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
        expect(moveSpy).toHaveBeenCalledTimes(1);
        expect(moveSpy).toHaveBeenCalledWith(-1);
        expect(restoreSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(restoreSnapshotSpy).toHaveBeenCalledWith(mockedSnapshot);
    });
});
