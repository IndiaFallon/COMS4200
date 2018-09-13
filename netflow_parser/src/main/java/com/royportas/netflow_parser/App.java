package com.royportas.netflow_parser;

import java.io.File;
import com.beust.jcommander.*;

class Args {
    @Parameter(
        names={"--in", "-i"},
        description="The CSV file to process",
        required=true
    )
    String inFile;

    @Parameter(
        names={"--out", "-o"},
        description="The CSV file to write to result to",
        required=true
    )
    String outFile;

    @Parameter(
        names={"--db", "-d"},
        description="The MaxMind GeoLite2 City database to use",
        required=true
    )
    String database;
}

/*
 * The entrypoint
 */
public class App {
    public static void main(String[] argv) throws Exception {

        Args args = new Args();

        JCommander.newBuilder()
            .addObject(args)
            .build()
            .parse(argv);
        
        if (!App.exists(args.inFile)) {
            System.err.println("inFile path is incorrect");
        }

        if (!App.exists(args.database)) {
            System.err.println("DB path is incorrect");
        }

        NProbe nprobe = new NProbe(args.database);
        nprobe.parse(args.inFile, args.outFile);
    }

    public static Boolean exists(String filename) {
        return new File(filename).isFile();
    }
}
