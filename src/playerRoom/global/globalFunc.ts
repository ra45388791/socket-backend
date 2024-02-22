

/// 產生隨機碼
function RandomCode(count: number): string {
    const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const dateNow = Date.now();
    const RandomStr: string[] = [];

    for (let i = 0; i < count; i++) {
        const RandomNum: number = (dateNow * (i + 1)) % code.length;
        RandomStr.push(code[RandomNum]);
    }
    return RandomStr.join();
}

export { RandomCode };