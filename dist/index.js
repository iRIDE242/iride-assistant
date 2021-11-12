"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const shopify_api_1 = __importStar(require("@shopify/shopify-api"));
require('dotenv').config();
const app = (0, express_1.default)();
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;
shopify_api_1.default.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    IS_EMBEDDED_APP: false,
    API_VERSION: shopify_api_1.ApiVersion.October21 // all supported versions are available, as well as "unstable" and "unversioned"
});
// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
// the rest of the example code goes here
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
        // not logged in, redirect to login
        res.redirect(`/login`);
    }
    else {
        res.send("Hello world!");
        // Load your app skeleton page with App Bridge, and do something amazing!
        res.end();
    }
}));
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});
app.listen(5000, () => {
    console.log('your app is now listening on port 5000');
});
//# sourceMappingURL=index.js.map