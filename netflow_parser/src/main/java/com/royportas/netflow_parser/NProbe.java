/**
 * Parses a nprobe file
 */
package com.royportas.netflow_parser;

import java.io.*;
import java.net.*;
import java.util.*;
import org.apache.commons.csv.*;
import com.maxmind.geoip2.*;
import com.maxmind.geoip2.model.*;
import com.maxmind.geoip2.exception.*;
import com.maxmind.geoip2.record.*;
import com.maxmind.db.CHMCache;
import me.tongfei.progressbar.*;


/*
 * A data class used to store IP information
 */
class IpRecord {
    public String city;
    public Double latitude;
    public Double longitude;
}

public class NProbe {
    private String inFile;
    private String outFile;

    private ArrayList<String> outCsvHeaders;

    private FileWriter out;
    private CSVPrinter printer;

    private DatabaseReader maxmind;

    /**
     * Creates the NProbe instance with the given parameters
     *
     * @param maxmindDatabase   The maxmind database
     */
    public NProbe(String maxmindDatabase)
            throws IOException {

        // Create the Maxmind instance
        this.maxmind = new DatabaseReader.Builder(new File(maxmindDatabase)).withCache(new CHMCache()).build(); 
    }

    /**
     * Parses the nprobe file
     *
     * @param inFile    The nprobe csv file to read from
     * @param outFile   The file to write the new csv file to
     */
    public void parse(String inFile, String outFile)
            throws IOException, FileNotFoundException, UnknownHostException, GeoIp2Exception {

        this.inFile = inFile;
        this.outFile = outFile;

        this.outCsvHeaders = new ArrayList<String>();

        // Create the reader
        Reader reader = new FileReader(this.inFile);

        CSVFormat csv = CSVFormat.RFC4180.withFirstRecordAsHeader();
        Iterable<CSVRecord> records = csv.parse(reader);
        

        // Open the out file
        this.out = new FileWriter(this.outFile);

        for (CSVRecord record : ProgressBar.wrap(records, "Geocoding")) {
            this.parseRecord(record);
        }

        // Close resources
        reader.close();
        this.out.close();
    }

    private void parseRecord(CSVRecord record)
            throws IOException, GeoIp2Exception {
        String dstIp = record.get("IPV4_DST_ADDR");
        IpRecord dst = this.getRecordFromIp(dstIp);

        String srcIp = record.get("IPV4_SRC_ADDR");
        IpRecord src = this.getRecordFromIp(srcIp);

        if (src == null || dst == null) {
            // Don't parse the record
            return;
        }
        
        // Convert the record to a map, which we can edit
        Map map = record.toMap();

        // Add the new fields to the record
        map.put("SRC_LATITUDE", src.latitude);
        map.put("SRC_LONGITUDE", src.longitude);
        map.put("SRC_CITY", src.city);

        map.put("DST_LATITUDE", dst.latitude);
        map.put("DST_LONGITUDE", dst.longitude);
        map.put("DST_CITY", dst.city);

        // Write the CSV to file
        // We need to create the header at runtime
        if (this.printer == null) {
            Set<String> set = map.keySet();
            String[] header = set.toArray(new String[0]);
            this.printer = CSVFormat.RFC4180.withHeader(header).print(this.out);
        }
    
        this.printer.printRecord(map.values());
    }

    /**
     * Gets the latitude and longitude from an IP address
     */
    private IpRecord getRecordFromIp(String ip)
            throws IOException, UnknownHostException, GeoIp2Exception {
        InetAddress ipAddr = InetAddress.getByName(ip);
        
        try {
            IpRecord record = new IpRecord();

            // Lookup the IP address
            CityResponse response = this.maxmind.city(ipAddr);
            City city = response.getCity();
            record.city = city.getName();

            // Parse the location
            Location loc = response.getLocation();
            record.latitude = loc.getLatitude();
            record.longitude = loc.getLongitude();

            return record;
        } catch (AddressNotFoundException e) {
            return null;
        }
    }
}
