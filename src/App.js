import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import list from './data.js';

const lcMatch = (q, s) => s.toLowerCase().indexOf(q.toLowerCase()) >= 0;

const isSearched = (query) => (item) => 
      !query || lcMatch(query, item.title) || lcMatch(query, item.author);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list, // same meaning as 'list: list,'
            query: '',
        };
        this.onSearchChange = this.onSearchChange.bind(this); // because js
    }

    onSearchChange(event) {
        this.setState({ query: event.target.value });
    }
    
    render() {
        const hello = '_ Client';
        const { list, query } = this.state;
        return (
            <AppPage greet={hello}>
                <Search value={query} onChange={this.onSearchChange}>
                    Search
                </Search>
                <Table list={list} pattern={query} />
            </AppPage>
        );
    }
}

const Search = ({ value, onChange, children }) =>
    <div className="search">
        <form>
            {children}
            <input type="text"
                   value={value} // doesn't seem necessary?
                   onChange={onChange} />
        </form>
    </div>

const Table = ({ list, pattern }) =>
    <div className="table">
        { list.filter(isSearched(pattern)).map((item) =>
            <div key={item.objectID} className="table-row">
                <span className="colTitle"><a href={item.url}>{item.title}</a></span>
                <span className="colAuthor">{item.author}</span>
                <span className="colComments">{item.num_comments}</span>
                <span className="colPoints">{item.points}</span>
            </div>
        )}
    </div>

const AppPage = ({greet, children}) =>
    <div className="App">
        <AppHeader hello={greet} />
            <div className="App-body">
                {children}
            </div>
        <AppFooter />
    </div>

function AppHeader({hello}) {
    let even = new Date() % 2;
//        function tick() {
//            even = !even;
//        }
    return(
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>
              React Tutorial: <em>{hello.replace("_", even ? "HN" : "NH")}</em>
            </h2>
        </div>
    );
}

setInterval(AppHeader, 1000);

const AppFooter = () =>
    <p className="App-footer">
        To start, edit <code>src/App.js</code> and save to reload.
    </p>

export default App;
