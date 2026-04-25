// Node part of user library
import fs from 'node:fs/promises';
export async function tryReadJSON(filePath) {
    try {
        console.log(`reading ${filePath}...`);
        const contents = await fs.readFile(filePath, { encoding: 'utf8' });
        return { data: JSON.parse(contents), ok: true };
    }
    catch (err) {
        const error = err;
        return { data: null, ok: false, msg: error.message };
    }
}
export async function tryWriteJSON(filePath, data) {
    try {
        console.log(`Writing ${filePath}...`);
        const pathComponents = filePath.split('/');
        pathComponents.pop();
        const directory = pathComponents.join('/');
        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, '\t'));
        console.log(`Wrote ${filePath}!`);
    }
    catch (error) {
        return new Error(`Could not write ${filePath}: ${error}`);
    }
}
export async function tryWriteImg(filePath, data) {
    try {
        console.log(`Writing ${filePath}...`);
        await fs.writeFile(filePath, data);
        console.log(`Wrote ${filePath}!`);
    }
    catch (error) {
        return new Error(`Could not write ${filePath}: ${error}`);
    }
}
//# sourceMappingURL=flowLocal.js.map