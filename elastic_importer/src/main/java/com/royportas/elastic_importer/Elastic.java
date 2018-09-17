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
import org.elasticsearch.action.admin.indices.mapping.put.PutMappingResponse;
import org.elasticsearch.action.admin.indices.mapping.put.PutMappingRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
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

        this.index = "geonetflow2";
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

    public void createIndex() throws IOException {
        System.out.println("Sending index creation request");
        CreateIndexRequest request = new CreateIndexRequest(this.index);
        CreateIndexResponse response = this.client.indices().create(request, RequestOptions.DEFAULT);

        if (response.isAcknowledged()) {
            System.out.println("Cluster acknowledged create index request");
        } else {
            System.err.println("Cluster failed to acknowledge create index request");
        }
    }

    public void setMapping() throws IOException {
        Map<String, Object> mapping = new HashMap<String, Object>();

        // The properties of the mapping
        Map<String, Object> properties = new HashMap<String, Object>();
        mapping.put("properties", properties); 

        // Set the types
        this.setField(properties, "APPLICATION_ID", "integer");
        this.setField(properties, "DOWNSTREAM_SESSION_ID", "integer");
        this.setField(properties, "DOWNSTREAM_TUNNEL_ID", "integer");
        this.setField(properties, "DST_CITY", "text");
        this.setField(properties, "DST_LATITUDE", "double");
        this.setField(properties, "DST_LONGITUDE", "double");
        this.setField(properties, "ENGINE_ID", "integer");
        this.setField(properties, "FIRST_SWITCHED", "integer");
        this.setField(properties, "FLOW_ID", "integer");
        this.setField(properties, "FLOW_PROTO_PORT", "integer");
        this.setField(properties, "IN_BYTES", "integer");
        this.setField(properties, "IN_PKTS", "integer");
        this.setField(properties, "IPV4_DST_ADDR", "ip");
        this.setField(properties, "IPV4_SRC_ADDR", "ip");
        this.setField(properties, "L4_DST_PORT", "integer");
        this.setField(properties, "L4_SRC_PORT", "integer");
        this.setField(properties, "L7_PROTO", "integer");
        this.setField(properties, "L7_PROTO_NAME", "text");
        this.setField(properties, "LAST_SWITCHED", "integer");
        this.setField(properties, "NPROBE_IPV4_ADDRESS", "ip");
        this.setField(properties, "OUT_BYTES", "integer");
        this.setField(properties, "OUT_PKTS", "integer");
        this.setField(properties, "PROTOCOL", "integer");
        this.setField(properties, "PROTOCOL_MAP", "text");
        this.setField(properties, "SRC_CITY", "text");
        this.setField(properties, "SRC_LATITUDE", "double");
        this.setField(properties, "SRC_LONGITUDE", "double");
        this.setField(properties, "SRC_TOS", "integer");
        this.setField(properties, "SRC_VLAN", "integer");
        this.setField(properties, "UNTUNNELED_IPV4_SRC_ADDR", "ip");
        this.setField(properties, "UNTUNNELED_PROTOCOL", "integer");
        this.setField(properties, "UPSTREAM_SESSION_ID", "integer");
        this.setField(properties, "UPSTREAM_TUNNEL_ID", "integer");

        System.out.println("Creating Type Mapping");
        PutMappingRequest request = new PutMappingRequest(this.index).source(mapping);
        request.type(this.type);
        PutMappingResponse mappingResponse = this.client.indices().putMapping(request, RequestOptions.DEFAULT);

        if (mappingResponse.isAcknowledged()) {
            System.out.println("Cluster acknowledged mapping request");
        } else {
            System.err.println("Cluster failed to acknowledge mapping request");
        }

    }

    /**
     * Sets the type of the field
     *
     * @param name  Name of the field
     * @param type  Type of the field
     */
    public void setField(Map<String, Object> properties, String name, String type) {
        Map<String, Object> options = new HashMap<String, Object>();
        options.put("type", type);

        properties.put(name, options);
    }
}
