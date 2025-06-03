

export function isStringEmpty(s: string | undefined | null): boolean {
    if (!s) {
        return true
    }
    return s.length === 0
}
