import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import SelectCustomizado from './componentes/SelectCustomizado';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SumitCustomizado';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor(){
        super();
        this.state = {
            titulo: "",
            preco: "",
            autorId: "",
            lista:[]
        }
        this.enviaForm = this.enviaForm.bind(this);
    }

    setFormField(fieldName, e){
        this.setState({[fieldName]: e.target.value});
    }

    enviaForm(evento){
        evento.preventDefault();
        $.ajax({
            url:'http://localhost:8080/api/livros',
            contentType:'application/json',
            dataType:'json',
            type:'post',
            data: JSON.stringify(
                {
                    titulo: this.state.titulo,
                    preco: this.state.preco,
                    autorId: this.state.autorId
                }
            ),
            success: (novaListagem) => {
                PubSub.publish('atualiza-lista-livros', novaListagem);
                this.setState({titulo: '', preco: '', autorId: ''});
            },
            error: (resposta) => {
                if(resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSende:() => {
                PubSub.publish("limpa-erros",{});
            }
        });
    }

    render(){
        return (
            <div>
                <div className="pure-form pure-form-aligned">
                    <form className="pure-form pure-form-aligned" onSubmit={ this.enviaForm } method="POST">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={ this.state.titulo } onChange={ this.setFormField.bind(this, "titulo") } label="Titulo" />
                    <InputCustomizado id="preco" type="text" name="preco" value={ this.state.preco } onChange={ this.setFormField.bind(this, "preco") } label="Preco" />
                    <SelectCustomizado id="autor" label="Autor" autores={ this.props.autores } onChange={ this.setFormField.bind(this, "autorId") } value={ this.state.autorId }/>
                    <SubmitCustomizado type="submit" className="pure-button pure-button-primary" label="Salvar" />
                    </form>
                </div>
            </div>
        );
    }

}

class TabelaLivros extends Component {

    render(){
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((livro) => {
                                return (
                                    <tr key={ livro.id }>
                                        <td>{ livro.titulo }</td>
                                        <td>{ livro.preco }</td>
                                        <td>{ livro.autor.nome }</td>
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

export default class LivroBox extends Component {
    
    constructor(){
        super();
        this.state = {
            lista: [],
            autores: []
        }
    }

    componentDidMount(){
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: "json",
            success: (response) => {
                this.setState({lista: response})
            }
        });

        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: "json",
            success: (response) => {
                this.setState({autores: response})
            }
        });

        PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
            this.setState({lista: novaLista});
        });

    }

    render(){
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros!</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={ this.state.autores }/>
                    <TabelaLivros lista={ this.state.lista }/>
                </div>
            </div>
        )
    }
}

