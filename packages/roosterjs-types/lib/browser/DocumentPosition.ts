// The is essentially an enum representing result from browser compareDocumentPosition API
// https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
const enum DocumentPosition {
    Same = 0,
    Disconnected = 1,
    Preceding = 2,
    Following = 4,
    Contains = 8,
    ContainedBy = 16,
    ImplementationSpecific = 32,
}

export default DocumentPosition;
