/**
 * @internal
 */
export default interface DialogItem<Strings extends string> {
    labelKey: Strings | null;
    unlocalizedLabel: string | null;
    initValue: string;
    autoFocus?: boolean;
}
