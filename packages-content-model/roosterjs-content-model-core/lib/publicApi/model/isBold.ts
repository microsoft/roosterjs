/**
 * Check if the given bold style represents a bold style
 * @param boldStyle The style to check
 */
export function isBold(boldStyle?: string): boolean {
    return (
        !!boldStyle && (boldStyle == 'bold' || boldStyle == 'bolder' || parseInt(boldStyle) >= 600)
    );
}
