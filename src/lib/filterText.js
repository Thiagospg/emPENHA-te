import nlp from 'compromise/compromise';

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

    }
    
}

export default filterText;