/**
 * Handles the elasticsearch connection
 */
package com.royportas.elastic_importer;

import java.io.IOException;
import java.lang.Exception;
import java.util.Map;
import java.util.HashMap;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.apache.http.HttpHost;

public class Elastic {

    // The IP Address to the Elastic cluster
    private String ipAddress;

    // The elasticsearch port
    private int port;

    // The method to connect to the cluster, either http or https
    private String method;

    // The elasticsearch client
    private RestHighLevelClient client;

    // The elasticsearch index to use
    private String index;
    
    // The type of the record to store in the index
    private String type;

    // The bulk request
    private BulkRequest request;

    public Elastic() throws IOException, Exception {
        this.ipAddress = "127.0.0.1";
        this.port = 9200;
        this.method = "http";

        this.index = "geonetflow";
        this.type = "record";

        System.out.format(
            "Connecting to %s://%s:%s\n",
            this.method,
            this.ipAddress,
            this.port
        );

        this.client = new RestHighLevelClient(
            RestClient.builder(
                new HttpHost(this.ipAddress, this.port, this.method)
            )
        );

        try {
            boolean alive = this.client.ping(RequestOptions.DEFAULT);
            if (alive) {
                System.out.println("Elasticsearch connected!");
            } else {
                throw new Exception("Could not ping Elasticsearch cluster");
            }
        } catch (IOException io) {
            throw new Exception("Could not connect to Elasticsearch cluster");
        }

        // Map<String, String> jsonMap = new HashMap<String, String>();
        // jsonMap.put("name", "Bob");
        // jsonMap.put("age", "22");
        // IndexRequest request = new IndexRequest("test", "person", "1").source(jsonMap);

        // this.client.index(request, RequestOptions.DEFAULT);
    }

    public void createBulkRequest() {
        this.request = new BulkRequest();
    }

    /**
     * Adds a record to the bulk request
     *
     * @param record    The record to add
     */
    public void add(Map<String, String> record, String id) {
        IndexRequest req = new IndexRequest(this.index, this.type, id).source(record);
        this.request.add(req);
    }

    /**
     * Sends the bulk request to the elastic cluster
     */
    public void sendBulkRequest() throws IOException {
        // Send the request if one is created
        if (this.request != null) {
            BulkResponse resp = this.client.bulk(this.request, RequestOptions.DEFAULT);

            if (resp.hasFailures()) {
                for (BulkItemResponse item : resp) {
                    if (item.isFailed()) {
                        System.err.println(item.getId() + ": " + item.getFailureMessage());
                    }
                }
            }
            this.request = null;
        }
    }

    public void close() throws IOException {
        if (this.client != null) {
            this.client.close();
        }
    }
}
