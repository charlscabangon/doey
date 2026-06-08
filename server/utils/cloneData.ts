export function cloneData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
};
