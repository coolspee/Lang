function parseFromJSON(rawjson){
    console.log("PARSING STUDYSHEET FROM JSON: "+rawjson)
    var recievedStudysheet = Object.assign(new Studysheet, JSON.parse(rawjson));
    console.log("recieved studysheet: ")
    console.log(recievedStudysheet)
    recievedStudysheet.parseTerms();
    return recievedStudysheet;
}

function arrayToSheet(arr, name){
    var toReturn = new Studysheet(name)
    for (var i = 0; i<arr.length; i++){
        toReturn.add(arr[i]);
    }
    return toReturn;
}

class Studysheet {
    
    constructor(name){
        this.name = name;
        this.terms = []
        this.length = 0;
    }
    add(term){
        this.terms.push(term)
        this.length++;

    }
    getNthTerm(n){
        //return just the nth term
        var theTerm = this.terms[n];
        return theTerm;
    }

    returnRawData(){
        return this.terms;
    }

    parseTerms(){
        for (var i = 0; i<this.terms.length; i++){
            if (this.terms[i].isMulti == false){
                var tmpTerm = Object.assign(new Term, this.terms[i]);
                this.terms[i] = tmpTerm;
            } else{
                var theTerm = this.terms[i]
                var tmpTerm = Object.assign(new MultiTerm(theTerm.terms, theTerm.answers, theTerm.question), theTerm);
                this.terms[i] = tmpTerm;
            }
        }
    }

    randomize(){
        for (let i = this.terms.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.terms[i];
            this.terms[i] = this.terms[j];
            this.terms[j] = temp;
        }
    }

    remove(n){
        return this.terms.splice(n, 1);
    }
    
    getFullLength(){
        var full = 0;
        for (var i = 0; i<this.terms.length; i++){
            if (this.terms[i].isMulti){
                full+=this.terms[i].length;
            } else {
                full++;
            }
        }
        return full;
    }

    convertToSingle(){
        //This returns an array
        var tmpTerms = []
        for (var i = 0; i<this.terms.length; i++){
            if (!this.terms[i].isMulti){
                tmpTerms.push(this.terms[i]);
            } else{
                var m = this.terms[i];
                for (var j = 0; j<m.length; j++){
                    var t = m.question+": "+m.terms[j]
                    var newterm = new Term(false, t, m.answers[j], m.hasImage);
                    if (m.hasImage){
                        newterm.addImage(m.imageSrc);
                    }
                    tmpTerms.push(newterm);
                }
            }
        }
        return tmpTerms;
    }

    swapTD(){
        for (var i = 0; i<this.terms.length; i++){
            let currentTerm = this.terms[i];
            currentTerm.swap();
        }
    }

    prep(){
        for (var i = 0; i<this.terms.length; i++){
            this.terms[i].stripExcess();
        }
    }

}

class Term {

    constructor(isMulti, term, answer, hasImage){
        console.log("Term Created")
        this.isMulti = isMulti;
        this.term = term;
        this.answer = answer;
        this.hasImage = hasImage;
        var data = {
            "question":term,
            "answer":answer
        }
        this.trainId = null;
    }

    returnArray(){
        var arr = [this.term,this.answer];
        return arr;
    }

    check(against){
        var ans = this.answer.toLowerCase;
        if (against.toLowerCase() == this.answer.toLowerCase()){
            return true;
        }
        return false;
    }

    addImage(src){
        this.imageSrc = src;
    }

    swap(){
        let tmp = this.answer;
        this.answer = this.term;
        this.term = tmp;
    }

    stripExcess(){
        this.answer = this.answer.replaceAll("&nbsp;", "")
        this.term = this.term.replaceAll("&nbsp;", "")
        this.answer = this.answer.replaceAll("<div></div>", "")
        this.term = this.term.replaceAll("<div></div>", "")
        this.term = this.term.replaceAll("<div><br></div>", "")
        this.term = this.term.replaceAll("<div><br></div>", "")
        this.term = this.term.replaceAll('"', "\u2019")
        this.term = this.term.replaceAll("\n", "_")
        this.term = this.term.replaceAll("\n", "_")
        this.term = this.term.replaceAll("\t", "   ")
        this.term = this.term.replaceAll("\t", "   ")
        this.answer = this.answer.replaceAll("<div><br></div>", "")
        this.answer = this.answer.replaceAll("<div><br></div>", "")
        this.answer = this.answer.replaceAll('"', "\u2019")
        this.answer = this.answer.replaceAll("\n", "_")
        this.answer = this.answer.replaceAll("\n", "_")
        this.answer = this.answer.replaceAll("\t", "   ")
        this.answer = this.answer.replaceAll("\t", "   ")
    }
}

class MultiTerm extends Term{
    

    constructor(terms, answers, question, hasImage){
        super(true, "multi", "multi", hasImage);
        this.terms = terms;
        this.answers = answers;
        this.question = question;
        this.defs = []
        for (var i = 0; i<terms.length; i++){
            var tmpDict = {
                "question":terms[i],
                "answer":answers[i]
            }
            this.defs.push(tmpDict);
        }
        this.length = terms.length;
    }


    multiCheck(against, i){
        if (this.answers[i] == against){
            return true
        }
        return false
    }

    swap(){
        for (var i = 0; i<this.terms.length; i++){
            let tmp = this.terms[i];
            this.terms[i] = this.answers[i];
            this.answers[i] = tmp;
        }
    }

    stripExcess(){
        for (var i = 0; i<this.answers.length; i++){
            this.answers[i] = this.answers[i].replaceAll("&nbsp;", "");
            this.terms[i] = this.terms[i].replaceAll("&nbsp;", "");
            this.answer = this.answer.replaceAll("<div></div>", "")
            this.term = this.term.replaceAll("<div></div>", "")
        }
    }

}


