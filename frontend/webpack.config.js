const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.js",

    mode: process.env.WEBPACK_SERVE ? "development" : "production",

    module: {
        rules: [
            // Javscript
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["env"] }
            },
            // CSS
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ]
            }
        ]
    },

    resolve: {
        // Resolve these types of files without requiring the file extension
        extensions: [".js", ".jsx"],
    },

    plugins: [
        // Copy public files
        new CopyWebpackPlugin(["./public"]),
    ],
}
