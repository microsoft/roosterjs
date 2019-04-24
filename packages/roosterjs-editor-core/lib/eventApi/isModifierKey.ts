// Returns true when the event was fired from a modifier key, otherwise false
export default function isModifierKey(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.altKey || event.metaKey;
}
