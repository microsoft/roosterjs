import * as Color from 'color';

const DefaultBaseLValue = 21.247; // L-value of #333333

/**
 * Get dark mode color for a given color
 * @param color The color to calculate from
 * @param baseLValue The Light value for base dark color in LAB format. @default the Light value for #333333
 */
export default function getDarkColor(
    color: string,
    baseLValue: number = DefaultBaseLValue
): string {
    const computedColor = getRgbColor(color);
    const colorLab = computedColor.lab().array();
    const newLValue = (100 - colorLab[0]) * ((100 - baseLValue) / 100) + baseLValue;
    color = Color.lab(newLValue, colorLab[1], colorLab[2])
        .rgb()
        .alpha(computedColor.alpha())
        .toString();

    return color;
}

function getRgbColor(color: string): Color {
    try {
        return Color(color || undefined);
    } catch {
        // For unrecognized color, always treat it as black since browser will also render it as black
        return Color('#000000');
    }
}
