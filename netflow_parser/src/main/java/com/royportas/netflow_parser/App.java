package com.royportas.netflow_parser;

import java.io.File;

/*
 * The entrypoint
 */
public class App {
    public static void main(String[] args) throws Exception {

        /*
        if (args.length < 1) {
            System.err.println("Needs one parameter, in filename");
            System.exit(1);
        }
        */

        // The in filename of the CSV
        String netflowFile = "/Volumes/Elements/nprobe-21.07.2017/nprobe-21.07.2017.csv";

        if (!App.exists(netflowFile)) {
            System.err.println("Netflow path is incorrect");
        }

        String maxmindDatabase = "GeoLite2-City.mmdb";

        if (!App.exists(maxmindDatabase)) {
            System.err.println("Maxmind database path is incorrect");
        }

        NProbe nprobe = new NProbe(maxmindDatabase);
        nprobe.parse(netflowFile, "outfile.csv");
    }

    public static Boolean exists(String filename) {
        return new File(filename).isFile();
    }
}
