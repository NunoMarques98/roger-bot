export default class Dialog {

    question : string;
    answer : any = null;

    constructor(question : string) {
        
        this.question = question;
    }

    setAnswer(answer : string) : void  {

        this.answer = answer;
    }
}