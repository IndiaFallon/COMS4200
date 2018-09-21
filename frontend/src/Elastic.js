/**
 * Contains general methods for interacting with the elasticsearch API
 */

export const ELASTIC_CONFIG = {
    INDEX: "geonetflow2",
    TYPE: "record",
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

export function getMapData(client, startTime, endTime) {
    return client.search({
        index: ELASTIC_CONFIG.index,
        type: ELASTIC_CONFIG.type,
        timeout: "30m",
        body: {
            "size": 0,
            "aggs": {
                "unique_src": {
                    "terms": {
                        "field": "IPV4_SRC_ADDR",
                        "size": 400
                    },
                    "aggs": {
                        "SUM_IN_BYTES": {
                            "sum": {
                                "field": "IN_BYTES"
                            }
                        },
                        "unique_dst": {
                            "terms": {
                                "field": "IPV4_DST_ADDR",
                                "size": 400
                            },
                            "aggs": {
                                "SUM_IN_BYTES": {
                                    "sum": {
                                        "field": "IN_BYTES"
                                    }
                                },
                                "DST_LATITUDE": {
                                    "min": {
                                        "field": "DST_LATITUDE"
                                    }
                                },
                                "DST_LONGITUDE": {
                                    "min": {
                                        "field": "DST_LONGITUDE"
                                    }
                                },
                                "SRC_LATITUDE": {
                                    "min": {
                                        "field": "SRC_LATITUDE"
                                    }
                                },
                                "SRC_LONGITUDE": {
                                    "min": {
                                        "field": "SRC_LONGITUDE"
                                    }
                                }
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
                            "match_all": {}
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": 1379647883664,
                                    "lte": 1537414283665,
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
            const results = [];

            const srcBuckets = resp.aggregations.unique_src.buckets;
            srcBuckets.forEach(srcBucket => {
                const dstBuckets = srcBucket.unique_dst.buckets;
                dstBuckets.forEach(dstBucket => {
                    results.push({
                        srcIp: srcBucket.key,
                        srcLat: dstBucket.SRC_LATITUDE.value,
                        srcLon: dstBucket.SRC_LONGITUDE.value,
                        dstIp: dstBucket.key,
                        dstLat: dstBucket.DST_LATITUDE.value,
                        dstLon: dstBucket.DST_LONGITUDE.value,
                        totalBytes: dstBucket.SUM_IN_BYTES.value,
                    });
                });
            });
            
            console.log(results);
            return results;
        }

        return [];
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
        type: ELASTIC_CONFIG.type,
        // Query from Kibana
        body: {
            "aggs": {
                "per_hour": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "1h",
                        "time_zone": "Australia/Brisbane",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "total_packets": {
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
            const values = resp.aggregations.per_hour.buckets.map(bucket => {
                return {
                    y: bucket.total_packets.value,
                    name: bucket.key,
                }
            });

            return values;
        }

        return [];
    });
}
