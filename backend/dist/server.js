"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const db_1 = __importDefault(require("./config/db"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const PORT = process.env.PORT || 5000;
// Connect to Database
(0, db_1.default)();
app_1.app.use("/api/notify", notification_routes_1.default);
app_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map