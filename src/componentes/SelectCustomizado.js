import React, { Component } from 'react';

export default class SelectCustomizado extends Component {

    render(){
        return (
            <div className="pure-u-1 pure-u-md-1-3">
                <label htmlFor={ this.props.id }>{ this.props.label }</label>
                <select name="autorId" id="autorId" className="pure-input-1-2" onChange={ this.props.onChange } value={ this.props.value }>
                    <option value="">Selecione o Autor</option>
                    {
                        this.props.autores.map((option) => {
                            return (
                                <option key={ option.id } value={ option.id }>{ option.nome }</option>
                            )
                        })
                    }
                </select>
            </div>
        );
    }

}