/**
 * Get CSS styles of a given element in name-value pair format
 * @param element The element to get styles from
 */
export default function getStyles(element: HTMLElement): Record<string, string> {
    const result: Record<string, string> = {};
    const style = element?.getAttribute('style') || '';
    style.split(';').forEach(pair => {
        // Quoted style values with ':' characters require special handling.
        // (eg. background: url("https://static.cdn.responsys.net/i2/responsysimages/lego/contentlibrary/y_welcome_program/emea_welcome1/Hero_A_EN/images/LEGO_MT_HERO-A_BG.png") )
        // This regular expression only matches ":" characters that are not part
        // of a quoted string.
        var regex = new RegExp('(?<!".*|\'.*):');
        const [name, value] = pair.split(regex);
        if (name && value) {
            result[name.trim()] = value.trim();
        }
    });
    return result;
}
