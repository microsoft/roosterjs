/**
 * Specify how to handle conflicts when retrieving format state
 * remove: removes the conflicting key from the result
 * keepFirst: retains the first value of the conflicting key
 * returnMultiple: sets 'Multiple' as the value if the conflicting value's type is string
 */
export type ConflictFormatSolution = 'remove' | 'keepFirst' | 'returnMultiple';
