function isAllWhiteSpaces(nod: CharacterData): boolean {
    return !/[^\t\n\r ]/.test(nod.textContent as string);
}

function isIgnorable(nod: Node): boolean {
    return (
        nod.nodeType === 8 || (nod.nodeType === 3 && isAllWhiteSpaces(nod as CharacterData))
    )
}

export function nodeBefore(sib: Node): HTMLInputElement | null {
    while ((sib = sib.previousSibling as ChildNode)) {
        if (!isIgnorable(sib)) return sib as HTMLInputElement;
    }
    return null;
}
