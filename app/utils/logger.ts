import fs from 'fs';

const getTimeStamp = (): string => {
    return new Date().toISOString();
};

const info = (namespace: string, messaage?: string, object?: any) => {
    if (object) {
        console.log(`[${getTimeStamp()}]: [INFO] [${namespace}]: ${messaage} `, object);
        writeLogsToFile(`[${getTimeStamp()}]: [INFO] [${namespace}]: ${messaage} `);
    } else {
        writeLogsToFile(`[${getTimeStamp()}]: [INFO] [${namespace}]: ${messaage} `);
        console.log(`[${getTimeStamp()}]: [INFO] [${namespace}]: ${messaage} `);
    }
};
const warn = (namespace: string, messaage?: string, object?: any) => {
    if (object) {
        console.warn(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `, object);
        writeLogsToFile(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `);
    } else {
        console.warn(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `);
        writeLogsToFile(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `);
    }
};
const debug = (namespace: string, messaage?: string, object?: any) => {
    if (object) {
        console.debug(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `, object);
        writeLogsToFile(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `);
    } else {
        console.debug(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `);
        writeLogsToFile(`[${getTimeStamp()}]: [debug] [${namespace}]: ${messaage} `);
    }
};
const error = (namespace: string, messaage?: string, object?: any) => {
    if (object) {
        console.error(`[${getTimeStamp()}]: [error] [${namespace}]: ${messaage} `, object);
        writeLogsToFile(`[${getTimeStamp()}]: [error] [${namespace}]: ${messaage} `);
    } else {
        console.error(`[${getTimeStamp()}]: [error] [${namespace}]: ${messaage} `);
        writeLogsToFile(`[${getTimeStamp()}]: [error] [${namespace}]: ${messaage} `);
    }
};

const writeLogsToFile = (logs: any) => {

    const filePath = './EruditeKidsLogs.log';

    fs.appendFile(filePath, logs + '\n', (err) => {
        if (err) { throw err; }
    });
};

export default {
    info, warn, error, debug, writeLogsToFile
};
