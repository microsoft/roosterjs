import UndoSnapshots from '../../undo/UndoSnapshots';

describe('SnapshotsManager', () => {
    let snapshots: UndoSnapshots;
    beforeEach(() => {
        snapshots = new UndoSnapshots();
        snapshots.addSnapshot('');
    });

    it('canMove', () => {
        expect(snapshots.canMove(-1)).toBeFalsy(); // snapshots: ('')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: ('')

        snapshots.addSnapshot('1'); // snapshots: '', ('1')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '', ('1')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: '', ('1')
    });

    it('move', () => {
        expect(snapshots.move(-1)).toBeNull(); // snapshots: (''), =>null
        expect(snapshots.move(1)).toBeNull(); // snapshots: (''), =>null

        snapshots.addSnapshot('1'); // snapshots: '', ('1')
        expect(snapshots.move(-1)).toBe(''); // snapshots: (''), '1'
        expect(snapshots.move(1)).toBe('1'); // snapshots: '', ('1')
        expect(snapshots.move(1)).toBe(null); // snapshots: '', ('1') =>null
    });

    it('addSnapshot', () => {
        snapshots = new UndoSnapshots(3); // snapshots: '1'
        snapshots.addSnapshot('1');
        snapshots.addSnapshot('23'); // snapshots: '1', ('23')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '1', ('23')
        expect(snapshots.move(-1)).toBe('1'); // snapshots: ('1'), '23'
        expect(snapshots.canMove(1)).toBeTruthy(); // snapshots: ('1'), '23'

        snapshots.addSnapshot('1'); // snapshots: ('1'), '23'
        expect(snapshots.canMove(-1)).toBeFalsy(); // snapshots: ('1'), '23'
        expect(snapshots.canMove(1)).toBeTruthy(); // snapshots: ('1'), '23'

        snapshots.addSnapshot('2'); // snapshots: '1', ('2')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: ('1'), '2'
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: ('1'), '2'

        snapshots.move(1); // snapshots: '1', ('2')
        snapshots.addSnapshot('34'); // snapshots: '2', ('34')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: '2', ('34')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '2', ('34')
        expect(snapshots.canMove(-2)).toBeFalsy(); // snapshots: '2', ('34')
    });

    it('clearSnapshotsOnRight', () => {
        snapshots.addSnapshot('2'); // snapshots: '', ('2')
        snapshots.addSnapshot('3'); // snapshots: '', '2', ('3')
        snapshots.move(-1); // snapshots: '', ('2'), '3'

        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '', ('2'), '3'
        expect(snapshots.canMove(1)).toBeTruthy(); // snapshots: '', ('2'), '3'
        expect(snapshots.canMove(2)).toBeFalsy(); // snapshots: '', ('2'), '3'

        snapshots.clearRedo(); // snapshots: '', ('2')
        expect(snapshots.canMove(-1)).toBeTruthy(); // snapshots: '', ('2')
        expect(snapshots.canMove(1)).toBeFalsy(); // snapshots: '', ('2')
    });
});
