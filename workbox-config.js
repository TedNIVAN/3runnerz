module.exports = {
    globDirectory: "docs",
    globPatterns: [
        "**/*.{html,js,css,png,svg,jpg,gif,json,woff,woff2,eot,ico,webmanifest,map}"
    ],
    swDest: "./service-worker.js",
    clientsClaim: true,
    skipWaiting: true
};