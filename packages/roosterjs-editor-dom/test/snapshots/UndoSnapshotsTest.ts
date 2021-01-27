import addSnapshot from '../../lib/snapshots/addSnapshot';
import canMoveCurrentSnapshot from '../../lib/snapshots/canMoveCurrentSnapshot';
import clearProceedingSnapshots from '../../lib/snapshots/clearProceedingSnapshots';
import createSnapshots from '../../lib/snapshots/createSnapshots';
import moveCurrentSnapsnot from '../../lib/snapshots/moveCurrentSnapsnot';
import { canUndoAutoComplete } from 'roosterjs-editor-dom';
import { UndoSnapshotsService } from 'roosterjs-editor-types';

describe('SnapshotsManager', () => {
    let snapshots: UndoSnapshotsService;
    beforeEach(() => {
        snapshots = createUndoSnapshots();
        snapshots.addSnapshot('', false);
    });

    it('canMove', () => {
        expect(snapshots.canMove(-1)).toBeFalsy(); // snapshots: ('')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: ('')

        snapshots.addSnapshot('1', false); // snapshots: '', ('1')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '', ('1')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: '', ('1')
    });

    it('move', () => {
        expect(snapshots.move(-1)).toBeNull(); // snapshots: (''), =>null
        expect(snapshots.move(1)).toBeNull(); // snapshots: (''), =>null

        snapshots.addSnapshot('1', false); // snapshots: '', ('1')
        expect(snapshots.move(-1)).toBe(''); // snapshots: (''), '1'
        expect(snapshots.move(1)).toBe('1'); // snapshots: '', ('1')
        expect(snapshots.move(1)).toBe(null); // snapshots: '', ('1') =>null
    });

    it('addSnapshot', () => {
        snapshots = createUndoSnapshots(3); // snapshots: '1'
        snapshots.addSnapshot('1', false);
        snapshots.addSnapshot('23', false); // snapshots: '1', ('23')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '1', ('23')
        expect(snapshots.move(-1)).toBe('1'); // snapshots: ('1'), '23'
        expect(snapshots.canMove(1)).toBeTruthy(); // snapshots: ('1'), '23'

        snapshots.addSnapshot('1', false); // snapshots: ('1'), '23'
        expect(snapshots.canMove(-1)).toBeFalsy(); // snapshots: ('1'), '23'
        expect(snapshots.canMove(1)).toBeTruthy(); // snapshots: ('1'), '23'

        snapshots.addSnapshot('2', false); // snapshots: '1', ('2')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: ('1'), '2'
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: ('1'), '2'

        snapshots.move(1); // snapshots: '1', ('2')
        snapshots.addSnapshot('34', false); // snapshots: '2', ('34')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: '2', ('34')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '2', ('34')
        expect(snapshots.canMove(-2)).toBeFalsy(); // snapshots: '2', ('34')
    });

    it('clearSnapshotsOnRight', () => {
        snapshots.addSnapshot('2', false); // snapshots: '', ('2')
        snapshots.addSnapshot('3', false); // snapshots: '', '2', ('3')
        snapshots.move(-1); // snapshots: '', ('2'), '3'

        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '', ('2'), '3'
        expect(snapshots.canMove(1)).toBeTruthy(); // snapshots: '', ('2'), '3'
        expect(snapshots.canMove(2)).toBeFalsy(); // snapshots: '', ('2'), '3'

        snapshots.clearRedo(); // snapshots: '', ('2')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '', ('2')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: '', ('2')
    });
});

function createUndoSnapshots(size: number = 1e7): UndoSnapshotsService {
    const snapshots = createSnapshots(size);

    return {
        canMove: (delta: number): boolean => canMoveCurrentSnapshot(snapshots, delta),
        move: (delta: number): string => moveCurrentSnapsnot(snapshots, delta),
        addSnapshot: (snapshot: string, autoComplete: boolean) =>
            addSnapshot(snapshots, snapshot, autoComplete),
        clearRedo: () => clearProceedingSnapshots(snapshots),
        canUndoAutoComplete: () => canUndoAutoComplete(snapshots),
    };
}
