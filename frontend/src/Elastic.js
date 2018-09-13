/**
 * Contains general methods for interacting with the elasticsearch API
 */

export const ELASTIC_CONFIG = {
    INDEX: "nprobe-2017.07.21",
    TYPE: "flows",
    HOST: "localhost:9200",
    // Change this after debugging is finished
    LOG: "warning",
}

/**
 * Gets the document count from Elastic, returning a promise
 */
export function getDocumentCount(client) {
    return client.count({
        index: ELASTIC_CONFIG.index,
    }).then(resp => {
        if (resp) {
            return resp.count;
        }
        return 0;
    });
}

/**
 * Gets the hourly aggregates for the given startTime and endTime
 *
 * @param {Number} startTime    The start time in epoche format
 * @param {Number} endTime      The end time in epoche format
 *
 * TODO: Implement startTime and endTime
 */
export function getHourlyAggregates(client, startTime, endTime) {
    return client.search({
        index: ELASTIC_CONFIG.index,
        type: "flows",
        // Query from Kibana
        body: {
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "1h",
                        "time_zone": "Australia/Brisbane",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "OUT_BYTES"
                            }
                        }
                    }
                }
            },
            "stored_fields": [
                "*"
            ],
            "docvalue_fields": [
                "@timestamp"
            ],
            "query": {
                "bool": {
                    "must": [
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": 1500559200000,
                                    "lte": 1500731999999,
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    ]
                }
            }
        }
    }).then(resp => {
        if (resp) {
            console.log(resp);
            const values = resp.aggregations["2"].buckets.map(bucket => {
                return {
                    y: bucket["1"].value,
                    name: bucket.key,
                }
            });

            return values;
        }

        return [];
    });
}
