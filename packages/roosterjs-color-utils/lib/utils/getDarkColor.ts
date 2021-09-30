import * as Color from 'color';

const baseLValue = 21.247; // L-value of #333333

/**
 * Get dark mode color for a given color
 * @param color The color to calculate from
 */
export default function getDarkColor(color: string): string {
    try {
        const computedColor = Color(color || undefined);
        const colorLab = computedColor.lab().array();
        const newLValue = (100 - colorLab[0]) * ((100 - baseLValue) / 100) + baseLValue;
        color = Color.lab(newLValue, colorLab[1], colorLab[2])
            .rgb()
            .alpha(computedColor.alpha())
            .toString();
    } catch {}

    return color;
}
