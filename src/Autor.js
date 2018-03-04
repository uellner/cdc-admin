import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SumitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor(){
        super();
        this.state = {
            nome: '',
            email: '',
            senha: ''
        };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    setNome(e){
        this.setState({nome: e.target.value});
    }
    
    setEmail(e){
        this.setState({email: e.target.value});
    }
    
    setSenha(e){
        this.setState({senha: e.target.value});
    }
    
    enviaForm(e){
        e.preventDefault();
        $.ajax({
            url:"http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType:'json',
            type:'post',
            data: JSON.stringify(
                {
                nome: this.state.nome,
                email: this.state.email,
                senha: this.state.senha
                }
            ),
            success: function(resposta){
                console.log("enviado com sucesso");
                PubSub.publish('atualiza-lista-autores', resposta);
                this.setState({nome:'', email:'', senha:''});
            }.bind(this),
            error: function(resposta){
                console.log("erro");
                if(resposta.status === 400){
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: () => {
                PubSub.publish('limpa-erros', {});
            }
        });
      }

    render(){
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={ this.enviaForm } method="POST">
                  <InputCustomizado id="nome" type="text" name="nome" value={ this.state.nome } onChange={ this.setNome } label="Nome" />
                  <InputCustomizado id="email" type="email" name="email" value={ this.state.email } onChange={ this.setEmail } label="Email" />
                  <InputCustomizado id="senha" type="password" name="senha" value={ this.state.senha } onChange={ this.setSenha } label="Senha" />
                  <SubmitCustomizado type="submit" className="pure-button pure-button-primary" label="Salvar" />
                </form>
            </div>
        );
    }

}

class TabelaAutores extends Component {

    render(){
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        this.props.lista.map((autor) => {
                            return (
                            <tr key={ autor.id }>
                                <td>{ autor.nome }</td>
                                <td>{ autor.email }</td>
                            </tr>
                            );  
                        })
                        }
                    </tbody>
                </table> 
            </div>
        );
    }

}

export default class AutorBox extends Component{

    constructor(){
        super();
        this.state = {
            lista: [],
        };
    }

    componentDidMount(){
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: "json",
            success: (response) => {
                this.setState({lista: response})
            }
        });

        PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => {
            this.setState({lista: novaLista});
        });
    }

    

    render(){
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Autores!</h1>
                </div>
                <FormularioAutor/>
                <TabelaAutores lista={ this.state.lista }/>
            </div>
        )
    }

}