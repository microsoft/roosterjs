/**
 * Key code enumeration
 * https://www.toptal.com/developers/keycode/table
 */
const enum KeyCode {
    /**
     * According to https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
     * 229 can be sent in variants generated when Long press (iOS) or using IM.
     *
     * Other cases: https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
     */
    dead = 229,
}
