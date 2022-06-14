/**
 * @internal
 */
export default interface DialogItem<Strings extends string> {
    labelKey: Strings | null;
    unlocalizedLabel: string;
    initValue: string;
    autoFocus?: boolean;
}
