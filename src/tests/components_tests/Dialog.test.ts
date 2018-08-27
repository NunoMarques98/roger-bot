import Dialog from "../../components/Dialog";

let dialog : Dialog;

beforeEach( () => {

    dialog = new Dialog("Test dialog");
})

describe("Dialog tests", () => {

    test("Property testing", () => {

        expect(dialog).toHaveProperty("answer");
        expect(dialog).toHaveProperty("question");
    })

    test("Dialog with no answer", () => {

        expect(dialog.answer).toBeNull();
    })

    test("Dialog with answer", () => {

        dialog.setAnswer("test");

        expect(dialog.answer).not.toBeNull();
    })
})