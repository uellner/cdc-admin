import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends Component {

    render(){
        return (
            <div>
                <a href="" id="menuLink" className="menu-link">
                    <span></span>
                </a>
                <div id="menu">
                    <div className="pure-menu">
                        <a className="pure-menu-heading">Company</a>
                        <ul className="pure-menu-list">
                            <li className="pure-menu-item">
                                <Link to="/" className="pure-menu-link">Home</Link>
                            </li>
                            <li className="pure-menu-item menu-item-divided">
                                <Link to="/autor" className="pure-menu-link">Autor</Link>
                            </li>
                            <li className="pure-menu-item menu-item-divided">
                                <Link to="/livro" className="pure-menu-link">Livros</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}