const ALPHABET = '0123456789abcdef';

const idMap = {};

/**
 *
 * @return {string}
 */
export default function uid() {

    /**
     *
     * @return {string}
     */
    const generate = () => {

        const s = [];
        for (let i = 0; i < 36; i++) {
            s[i] = ALPHABET.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = ALPHABET.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    };

    let result = generate();

    while (idMap[result]) {
        result = generate();
    }

    idMap[result] = true;

    return result;
}