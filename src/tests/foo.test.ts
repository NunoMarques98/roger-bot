import DeadLine from "../components/DeadLine";


test("Testing fields", () => {

    let deadLine : DeadLine = new DeadLine("27/08/98", "27/08/98", "0", "Zero", "Birthday", "ts", "0");

    expect(deadLine.checkFields("27/08/98", "27/08/98", "Birthday", "ts")).toBe(true);
})