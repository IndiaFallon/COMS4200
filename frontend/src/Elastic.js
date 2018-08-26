/**
 * Contains general methods for interacting with the elasticsearch API
 */

export const ELASTIC_CONFIG = {
    INDEX: "nprobe-2017.07.21",
    TYPE: "flows",
    HOST: "localhost:9200",
    // Change this after debugging is finished
    LOG: "trace",
}

/**
 * Gets the document count from Elastic, returning a promise
 */
export function getDocumentCount(client) {
    console.log("Getting document count");
    return client.count({
        index: ELASTIC_CONFIG.index,
    }).then(resp => {
        if (resp) {
            return resp.count;
        }
        return 0;
    });
}
