const Dialog = require('./dialog');

class DialogChain {

    constructor() {

        this.dialogs = [];
        this.fase = 0;
    }

    addDialog(dialog) {

        this.dialogs.push(dialog);
    }

    modifyDialog(fase, answer) {

        let dialogToChange = this.dialogs[fase];

        dialogToChange.setAnswer(answer);
    }
}