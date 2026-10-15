// Sort a list by one field; strings compare alphabetically, everything else numerically.
export const sortBy = (list, { field, dir }) => {
    const sign = dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
        const x = a[field];
        const y = b[field];
        return (typeof x === "string" ? x.localeCompare(y) : x - y) * sign;
    });
};
