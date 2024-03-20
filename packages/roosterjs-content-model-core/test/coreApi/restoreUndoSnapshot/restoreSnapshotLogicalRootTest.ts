import { EditorCore, Snapshot } from 'roosterjs-content-model-types';
import { restoreSnapshotLogicalRoot } from '../../../lib/coreApi/restoreUndoSnapshot/restoreSnapshotLogicalRoot';
import { setLogicalRoot } from '../../../lib/coreApi/setLogicalRoot/setLogicalRoot';

describe('restoreSnapshotLogicalRoot', () => {
    let core: EditorCore;
    let contentDiv: HTMLDivElement;

    beforeEach(() => {
        core = {
            api: {
                setLogicalRoot,
                triggerEvent: () => {},
            },
            selection: {},
            cache: {},
        } as any;
    });

    describe('Had no custom logical root before', () => {
        beforeEach(() => {
            contentDiv = document.createElement('div');
            (core as any).physicalRoot = contentDiv;
            core.logicalRoot = contentDiv;
        });

        it('No custom logical root', () => {
            const snapshot: Snapshot = {
                isDarkMode: false,
                html: '',
            };

            restoreSnapshotLogicalRoot(core, snapshot);

            expect(core.physicalRoot).toEqual(contentDiv);
            expect(core.logicalRoot).toEqual(contentDiv);
        });

        it('Nested logical root', () => {
            const insideElement = document.createElement('div');
            contentDiv.appendChild(insideElement);
            insideElement.innerHTML = 'TEST';

            const snapshot: Snapshot = {
                isDarkMode: false,
                html: '',
                logicalRootPath: [0, 0],
            };

            restoreSnapshotLogicalRoot(core, snapshot);

            expect(core.physicalRoot).toEqual(contentDiv);
            expect(core.logicalRoot).toEqual(insideElement);
        });
    });

    describe('Had custom logical root before', () => {
        beforeEach(() => {
            contentDiv = document.createElement('div');
            (core as any).physicalRoot = contentDiv;
            core.logicalRoot = document.createElement('div');
        });

        it('No custom logical root', () => {
            const snapshot: Snapshot = {
                isDarkMode: false,
                html: '',
            };

            restoreSnapshotLogicalRoot(core, snapshot);

            expect(core.physicalRoot).toEqual(contentDiv);
            expect(core.logicalRoot).toEqual(contentDiv);
        });

        it('Nested logical root', () => {
            const insideElement = document.createElement('div');
            contentDiv.appendChild(insideElement);
            insideElement.innerHTML = 'TEST';

            const snapshot: Snapshot = {
                isDarkMode: false,
                html: '',
                logicalRootPath: [0, 0],
            };

            restoreSnapshotLogicalRoot(core, snapshot);

            expect(core.physicalRoot).toEqual(contentDiv);
            expect(core.logicalRoot).toEqual(insideElement);
        });
    });
});
