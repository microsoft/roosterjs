import { parseColor } from '../../../lib/formatHandlers/utils/color';
// import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
// import { SnapshotsManager } from 'roosterjs-content-model-types';

// describe('getColor with snapshots', () => {
//     it('getColor from no color, light mode', () => {
//         const parseColorValue = jasmine.createSpy().and.returnValue({
//             lightModeColor: 'green',
//         });
//         const snapshots = ({ parseColorValue } as any) as SnapshotsManager;
//         const div = document.createElement('div');
//         const color = getColor(div, false, false, snapshots);

//         expect(color).toBe('green');
//         expect(parseColorValue).toHaveBeenCalledTimes(1);
//         expect(parseColorValue).toHaveBeenCalledWith(undefined, false);
//     });

//     it('getColor from no color, dark mode', () => {
//         const parseColorValue = jasmine.createSpy().and.returnValue({
//             lightModeColor: 'green',
//         });
//         const snapshots = ({ parseColorValue } as any) as SnapshotsManager;
//         const div = document.createElement('div');
//         const color = getColor(div, false, true, snapshots);

//         expect(color).toBe('green');
//         expect(parseColorValue).toHaveBeenCalledTimes(1);
//         expect(parseColorValue).toHaveBeenCalledWith(undefined, true);
//     });

//     it('getColor from style color, dark mode', () => {
//         const parseColorValue = jasmine.createSpy().and.returnValue({
//             lightModeColor: 'green',
//         });
//         const snapshots = ({ parseColorValue } as any) as SnapshotsManager;
//         const div = document.createElement('div');

//         div.style.color = 'red';
//         div.setAttribute('color', 'blue');
//         const color = getColor(div, false, true, snapshots);

//         expect(color).toBe('green');
//         expect(parseColorValue).toHaveBeenCalledTimes(1);
//         expect(parseColorValue).toHaveBeenCalledWith('red', true);
//     });

//     it('getColor from attr color, dark mode', () => {
//         const parseColorValue = jasmine.createSpy().and.returnValue({
//             lightModeColor: 'green',
//         });
//         const snapshots = ({ parseColorValue } as any) as SnapshotsManager;
//         const div = document.createElement('div');

//         div.setAttribute('color', 'blue');
//         const color = getColor(div, false, true, snapshots);

//         expect(color).toBe('green');
//         expect(parseColorValue).toHaveBeenCalledTimes(1);
//         expect(parseColorValue).toHaveBeenCalledWith('blue', true);
//     });

//     it('getColor from attr color with var, dark mode', () => {
//         const parseColorValue = jasmine.createSpy().and.returnValue({
//             lightModeColor: 'green',
//         });
//         const snapshots = ({ parseColorValue } as any) as SnapshotsManager;
//         const div = document.createElement('div');

//         div.style.color = 'var(--varName, blue)';
//         const color = getColor(div, false, true, snapshots);

//         expect(color).toBe('green');
//         expect(parseColorValue).toHaveBeenCalledTimes(1);
//         expect(parseColorValue).toHaveBeenCalledWith('var(--varName, blue)', true);
//     });

//     it('getColor from style color with data-ogsc, dark mode', () => {
//         const parseColorValue = jasmine.createSpy().and.returnValue({
//             lightModeColor: 'green',
//         });
//         const getKnownColors = jasmine.createSpy('getKnownColors').and.returnValue({});
//         const snapshots = ({ parseColorValue, getKnownColors } as any) as SnapshotsManager;
//         const div = document.createElement('div');

//         div.dataset.ogsc = 'yellow';
//         div.style.color = 'red';
//         const color = getColor(div, false, true, snapshots);

//         expect(color).toBe('green');
//         expect(parseColorValue).toHaveBeenCalledTimes(1);
//         expect(parseColorValue).toHaveBeenCalledWith('red', true);
//     });
// });

// describe('setColor with snapshots', () => {
//     it('setColor from no color, light mode', () => {
//         const snapshots = ({} as any) as SnapshotsManager;
//         const div = document.createElement('div');
//         setColor(div, '', false, false, snapshots);

//         expect(div.outerHTML).toBe('<div></div>');
//     });

//     it('setColor from no color, dark mode', () => {
//         const updateKnownColor = jasmine.createSpy();
//         const getDarkColor = jasmine.createSpy().and.returnValue('green');
//         const snapshots = ({ updateKnownColor, getDarkColor } as any) as SnapshotsManager;
//         const div = document.createElement('div');
//         setColor(div, '', false, true, snapshots);

//         expect(div.outerHTML).toBe('<div></div>');
//         expect(getDarkColor).toHaveBeenCalledTimes(0);
//         expect(updateKnownColor).toHaveBeenCalledTimes(0);
//     });

//     it('setColor from a valid color, light mode, no darkColorHandler', () => {
//         const div = document.createElement('div');
//         setColor(div, 'green', false, true);

//         expect(div.outerHTML).toBe('<div style="color: green;"></div>');
//     });

//     itChromeOnly('setColor from a color with existing color, dark mode', () => {
//         const registerColor = jasmine.createSpy().and.returnValue('green');
//         const snapshots = ({ registerColor } as any) as SnapshotsManager;
//         const div = document.createElement('div');

//         div.style.color = 'blue';
//         div.setAttribute('color', 'yellow');
//         setColor(div, 'red', false, true, snapshots);

//         expect(div.outerHTML).toBe('<div color="yellow" style="color: green;"></div>');
//         expect(registerColor).toHaveBeenCalledTimes(1);
//         expect(registerColor).toHaveBeenCalledWith('red', true);
//     });
// });

describe('parseColor', () => {
    it('empty string', () => {
        const result = parseColor('');
        expect(result).toBe(null);
    });

    it('unrecognized color', () => {
        const result = parseColor('aaa');
        expect(result).toBe(null);
    });

    it('short hex 1', () => {
        const result = parseColor('#aaa');
        expect(result).toEqual([170, 170, 170]);
    });

    it('short hex 2', () => {
        const result = parseColor('#aaab');
        expect(result).toEqual(null);
    });

    it('short hex 3', () => {
        const result = parseColor('   #aaa   ');
        expect(result).toEqual([170, 170, 170]);
    });

    it('long hex 1', () => {
        const result = parseColor('#ababab');
        expect(result).toEqual([171, 171, 171]);
    });

    it('long hex 2', () => {
        const result = parseColor('#abababc');
        expect(result).toEqual(null);
    });

    it('long hex 3', () => {
        const result = parseColor('  #ababab  ');
        expect(result).toEqual([171, 171, 171]);
    });

    it('rgb 1', () => {
        const result = parseColor('rgb(1,2,3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 2', () => {
        const result = parseColor('   rgb(   1   ,   2  ,  3  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 3', () => {
        const result = parseColor('rgb(1.1, 2.2, 3.3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 1', () => {
        const result = parseColor('rgba(1, 2, 3, 4)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 2', () => {
        const result = parseColor('    rgba(   1.1   ,    2.2   ,  3.3  ,  4.4  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 3', () => {
        const result = parseColor('rgba(1.1, 2.2, 3.3, 4.4)');
        expect(result).toEqual([1, 2, 3]);
    });
});
