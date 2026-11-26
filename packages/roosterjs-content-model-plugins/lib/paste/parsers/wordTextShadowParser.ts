import { createWordCssLookup } from '../WordDesktop/createWordCssLookup';
import type { FormatParser, TextShadowFormat } from 'roosterjs-content-model-types';

const prefix = 'mso-effects-shadow-';
const names = [
    'color',
    'alpha',
    'dpiradius',
    'dpidistance',
    'angledirection',
    'pctsx',
    'pctsy',
    'anglekx',
    'angleky',
];
const pointMeasure = /^(?:\d+(?:\.\d+)?|\.\d+)pt$/;
const percentage = /^(?:\d+(?:\.\d+)?|\.\d+)%$/;

/**
 * @internal
 */
export function createWordTextShadowParser(html: string): FormatParser<TextShadowFormat> {
    const lookup = createWordCssLookup(
        html,
        names.map(name => prefix + name)
    );
    return (format, element) => {
        if (element.style.textShadow) {
            return;
        }
        const styles = lookup(element);
        const value = (name: string) => styles[prefix + name]?.trim().toLowerCase();
        const radius = value('dpiradius');
        const distance = value('dpidistance');
        const direction = value('angledirection');
        const sx = value('pctsx');
        const sy = value('pctsy');
        const kx = value('anglekx');
        const ky = value('angleky');
        const color = value('color');
        const alpha = value('alpha');
        const zeroGeometry =
            radius &&
            pointMeasure.test(radius) &&
            parseFloat(radius) == 0 &&
            distance &&
            pointMeasure.test(distance) &&
            parseFloat(distance) == 0 &&
            direction == '0' &&
            kx == '0' &&
            ky == '0';
        if (zeroGeometry && sx == '0%' && sy == '0%') {
            format.textShadow = 'none';
        } else if (
            radius &&
            pointMeasure.test(radius) &&
            parseFloat(radius) == 0 &&
            distance &&
            pointMeasure.test(distance) &&
            direction &&
            /^-?\d+$/.test(direction) &&
            Number.isFinite(Number(direction)) &&
            sx &&
            percentage.test(sx) &&
            parseFloat(sx) == 100 &&
            sy &&
            percentage.test(sy) &&
            parseFloat(sy) == 100 &&
            kx == '0' &&
            ky == '0' &&
            /^#[0-9a-f]{6}$/.test(color || '') &&
            (!alpha || (percentage.test(alpha) && parseFloat(alpha) <= 100))
        ) {
            // Native direction is clockwise from the x axis in 60,000ths of a degree.
            const radians = (((Number(direction) / 60000) % 360) * Math.PI) / 180;
            const length = parseFloat(distance);
            const x = Number((length * Math.cos(radians)).toFixed(6));
            const y = Number((length * Math.sin(radians)).toFixed(6));
            const rgb = [1, 3, 5].map(start => parseInt(color.substr(start, 2), 16));
            format.textShadow = `rgba(${rgb.join(', ')}, ${
                alpha ? parseFloat(alpha) / 100 : 1
            }) ${x}pt ${y}pt 0px`;
        }
    };
}
