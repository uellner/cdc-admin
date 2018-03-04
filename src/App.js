import React, { Component } from 'react';
import './css/pure.css';
import './css/side-menu.css';
import Menu from './Menu';

class App extends Component {

  render() {
      return (
          <div id="layout">
              <div className="content" id="content">
                  <Menu/>
                  <div id="main">
                      { this.props.children }
                  </div>
              </div>
          </div>
      );
  }
}

export default App;
