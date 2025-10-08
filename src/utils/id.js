export function nanoid(size = 16) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let id = '';
    const cryptoObj = typeof crypto !== 'undefined' ? crypto : undefined;
    if (cryptoObj?.getRandomValues) {
        const values = cryptoObj.getRandomValues(new Uint32Array(size));
        for (let i = 0; i < size; i += 1) {
            id += chars[values[i] % chars.length];
        }
        return id;
    }
    for (let i = 0; i < size; i += 1) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}
