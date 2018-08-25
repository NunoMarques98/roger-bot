"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeadLine_1 = require("../components/DeadLine");
test("Testing fields", () => {
    let deadLine = new DeadLine_1.default("27/08/98", "27/08/98", "0", "Zero", "Birthday", "ts", "0");
    expect(deadLine.checkFields("27/08/98", "27/08/98", "Birthday", "ts")).toBe(true);
});
//# sourceMappingURL=foo.test.js.map