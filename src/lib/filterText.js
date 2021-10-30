import nlp from 'compromise/compromise';
import axios from 'axios';
const Filter = require('../../node_modules/bad-words/lib/badwords')
const badWord = new Filter();
const first_names_br = require('./first_names_br.json');

nlp.extend((Doc, world) => {
    world.addTags({
        PName: {
            isA: 'Person'
        }
    })
})

const filterText = {
    havePersonName: async function (text) {
        let doc = nlp(text, first_names_br);
        let names = doc.match('#PName');
 
        if(names.text() === ''){
            return false;
        } else {
            for (var i = 0; i < names.length; i++) {
                let response = await axios.get('https://servicodados.ibge.gov.br/api/v2/censos/nomes/'+names.list[i].text())
                if(response.data[0]){
                    return true;
                }         
            }
            return false;
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