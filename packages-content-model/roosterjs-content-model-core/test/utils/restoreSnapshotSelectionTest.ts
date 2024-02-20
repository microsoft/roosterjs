import { EditorCore, Snapshot, SnapshotSelection } from 'roosterjs-content-model-types';
import { restoreSnapshotSelection } from '../../lib/utils/restoreSnapshotSelection';

describe('restoreSnapshotSelection', () => {
    let core: EditorCore;
    let div: HTMLDivElement;
    let setDOMSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        div = document.createElement('div');

        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');

        core = {
            contentDiv: div,
            api: {
                setDOMSelection: setDOMSelectionSpy,
            },
        } as any;
    });

    describe('Image selection', () => {
        let image: HTMLImageElement;
        const id1 = 'ID1';
        const id2 = 'ID2';

        beforeEach(() => {
            image = document.createElement('img');
            image.id = id1;

            div.appendChild(image);
        });

        it('Valid image', () => {
            const snapshotSelection: SnapshotSelection = {
                type: 'image',
                imageId: id1,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'image',
                image: image,
            });
        });

        it('Invalid image', () => {
            const snapshotSelection: SnapshotSelection = {
                type: 'image',
                imageId: id2,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });
    });

    describe('Table selection', () => {
        let table: HTMLTableElement;
        const id1 = 'ID1';
        const id2 = 'ID2';
        const coordinates = {
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        };

        beforeEach(() => {
            table = document.createElement('table');
            table.id = id1;

            div.appendChild(table);
        });

        it('Valid table', () => {
            const snapshotSelection: SnapshotSelection = {
                type: 'table',
                tableId: id1,
                ...coordinates,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'table',
                table: table,
                ...coordinates,
            });
        });

        it('Invalid image', () => {
            const snapshotSelection: SnapshotSelection = {
                type: 'table',
                tableId: id2,
                ...coordinates,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });
    });

    describe('Range selection', () => {
        let setStartSpy: jasmine.Spy;
        let setEndSpy: jasmine.Spy;
        let mockedRange: Range;

        beforeEach(() => {
            setStartSpy = jasmine.createSpy('setStart');
            setEndSpy = jasmine.createSpy('setEnd');

            mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
            } as any;

            spyOn(document, 'createRange').and.returnValue(mockedRange);
        });

        it('Empty array', () => {
            const snapshotSelection: SnapshotSelection = {
                type: 'range',
                start: [],
                end: [],
                isReverted: false,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setEndSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(div, 0);
            expect(setEndSpy).toHaveBeenCalledWith(div, 0);
        });

        it('Set to child SPAN', () => {
            div.innerHTML =
                '<div id="div1"><br></div><div id="div2"><span id="span1"></span><span id="span2"></span></div>';

            const snapshotSelection: SnapshotSelection = {
                type: 'range',
                start: [1, 0],
                end: [1, 1],
                isReverted: false,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;
            const div2 = div.querySelector('#div2');

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setEndSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(div2, 0);
            expect(setEndSpy).toHaveBeenCalledWith(div2, 1);
        });

        it('Set to deeper child SPAN', () => {
            div.innerHTML =
                '<div id="div1"><br></div><div id="div2"><span id="span1"></span><span id="span2"></span></div>';

            const snapshotSelection: SnapshotSelection = {
                type: 'range',
                start: [1, 0, 0],
                end: [1, 1, 0],
                isReverted: false,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;
            const span1 = div.querySelector('#span1');
            const span2 = div.querySelector('#span2');

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setEndSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(span1, 0);
            expect(setEndSpy).toHaveBeenCalledWith(span2, 0);
        });

        it('Set to text node', () => {
            div.innerHTML =
                '<div id="div1"><br></div><div id="div2"><span id="span1">test1<br>test2</span></div>';

            const snapshotSelection: SnapshotSelection = {
                type: 'range',
                start: [1, 0, 0, 1],
                end: [1, 0, 2, 3],
                isReverted: false,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;
            const span1 = div.querySelector('#span1');

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setEndSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(span1!.firstChild, 1);
            expect(setEndSpy).toHaveBeenCalledWith(span1!.lastChild, 3);
        });

        it('Set to invalid offset', () => {
            div.innerHTML = '<div id="div1"><br id="br1"></div>';

            const snapshotSelection: SnapshotSelection = {
                type: 'range',
                start: [0, 0, 0, 1],
                end: [0, 2, 2, 3],
                isReverted: false,
            };
            const snapshot: Snapshot = {
                selection: snapshotSelection,
            } as any;
            const br1 = div.querySelector('#br1');
            const div1 = div.querySelector('#div1');

            restoreSnapshotSelection(core, snapshot);

            expect(setDOMSelectionSpy).toHaveBeenCalledWith(core, {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setEndSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(br1, 0);
            expect(setEndSpy).toHaveBeenCalledWith(div1, 2);
        });
    });
});
