package com.royportas.elastic_importer;

import java.util.ArrayList;
import java.util.Map;
import java.util.Iterator;
import java.io.FileReader;
import java.io.Reader;
import java.io.FileNotFoundException;
import java.io.IOException;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import me.tongfei.progressbar.ProgressBar;
import me.tongfei.progressbar.ProgressBarBuilder;


public class NProbe {
    /**
     * Parses the nprobe file
     *
     * @param file    The nprobe csv file to read from
     */
    public void parse(String file, Elastic elastic)
            throws IOException, FileNotFoundException {

        ArrayList<String> outCsvHeaders = new ArrayList<String>();

        // Create the reader
        Reader reader = new FileReader(file);

        CSVFormat csv = CSVFormat.RFC4180.withFirstRecordAsHeader();
        Iterable<CSVRecord> records = csv.parse(reader);

        // Setup a progress bar
        ProgressBarBuilder pbb = new ProgressBarBuilder()
            .setInitialMax(12976567);

        int count = 0;

        elastic.createBulkRequest();
        
        for (CSVRecord record : ProgressBar.wrap(records, pbb)) {
            // Convert the record to a map, which we can edit
            Map<String, String> map = record.toMap();

            elastic.add(map, String.valueOf(count));
            count++;

            if (count % 1000 == 0) {
                // Send the request, start a new batch
                elastic.sendBulkRequest();
                elastic.createBulkRequest();
            }
        }

        // Finally send the last of the data
        elastic.sendBulkRequest();

        // Close resources
        reader.close();
    }
}
