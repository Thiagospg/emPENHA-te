import nlp from 'compromise/compromise';
const Filter = require('../../node_modules/bad-words/lib/badwords')
const badWord = new Filter();
const first_names_br = require('./first_names_br.json');

const filterText = {
    havePersonName: function(text){
        let doc = nlp(text, first_names_br);
        let name = doc.match('#FirstName');

        if(name.text() === ''){
            return false;
        } else {
            return true;
        }
    },
    haveBadWord: function(text){
        if(!badWord.isProfane(text)){
            return false;
        } else{
            return true;
        }
    }
}

export default filterText;