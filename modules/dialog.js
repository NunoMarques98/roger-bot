class Dialog {

    constructor(question) {

        this.question = question;
        this.answer = null;

    }

    setAnswer(answer) {

        this.answer = answer;
    }
}

module.exports = Dialog;