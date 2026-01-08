"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDailyArticles = void 0;
const functions = require("firebase-functions");
const YOUR_DOMAIN = ((_a = functions.config().app) === null || _a === void 0 ? void 0 : _a.domain) || process.env.NEXT_PUBLIC_SITE_URL || 'https://aara.ai';
exports.fetchDailyArticles = functions.pubsub
    .schedule('every 24 hours')
    .timeZone('UTC')
    .onRun(async () => {
    try {
        const apiUrl = `${YOUR_DOMAIN}/api/articles/fetch`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
});
//# sourceMappingURL=fetchArticles.js.map