import PubSub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(erros){
        for (let i of erros.errors){
            PubSub.publish("erro-validacao", i);
        }
    }
}