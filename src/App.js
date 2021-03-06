import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const COMMENTS_BASE = 'https://news.ycombinator.com/item?id=';

const lcMatch = (q, s) => s && s.toLowerCase().indexOf(q.toLowerCase()) >= 0;

const isSearched = (query) => (item) => 
      !query || lcMatch(query, item.title) || lcMatch(query, item.author);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answer: null,
            query: DEFAULT_QUERY
        };

        // bind member functions
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.getHitCount = this.getHitCount.bind(this);
        this.fetchOC = this.fetchOC.bind(this);
        this.setOC = this.setOC.bind(this);
    }

    setSearchTopStories(answer) {
        this.setState({
            answer: answer
        });
    }

    setOC(blob) {
        const url = URL.createObjectURL(blob);
        // console.log(`${blob.type} ${blob.size} bytes: ${url}`);
        this.setState({
            ocUrl: url
        });
	// console.log("New state = " + this.state);
    }

    fetchOC() {
        if ('ocUrl' in this.state)
            console.log("Already set");
        else {
            fetch('https://orangecrayon.com/images/orangecrayon.jpg')
                .then(response => response.blob())
                .then(blob => this.setOC(blob));
        }
    }

    fetchSearchTopStories(query) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result));
    }

    componentDidMount() {
        const { query } = this.state;
        this.fetchSearchTopStories(query);
    }

    onSearchChange(event) {
        this.setState({ query: event.target.value });
    }
    
    onSearchSubmit(event) {
        const { query } = this.state;
        this.fetchSearchTopStories(query);
        event.preventDefault(); // don't reload page
    }
    
    getHitCount() {
        return this.state.answer &&
            <span className='count'>{this.state.answer.hits.length} hits</span>;
    }

    render() {
        const hello = '_ Client';
        const { query, answer, ocUrl } = this.state;
        return (
            <AppPage greet={hello}>
                <Search value={query} 
                        count={this.getHitCount()}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}>
                    Search
                </Search>
		<Right>
                    <Link onClick={this.fetchOC}>OC</Link>
                    { ocUrl && <OC src={ocUrl}/> }
	        </Right>
                { answer && <Table list={answer.hits} pattern={query} /> }
            </AppPage>
        );
    }
}

const Right = ({children}) =>
    <div className="righto">
        {children}
    </div>;

const OC = ({src}) =>
    <img src={src} alt="Orange Crayon" height="40"/>;

const Search = ({ value, count, onChange, onSubmit, children }) =>
    <div className="search">
        <form onSubmit={onSubmit}>
            <input type="text"
                   value={value} // doesn't seem necessary?
                   onChange={onChange} />
            <Button onClick={onSubmit} children={children} />
            {count}
        </form>
    </div>;

const Link = ({ onClick, children }) =>
    <button onClick={onClick} type="button">
        {children}
    </button>;

const Button = ({ onClick, children }) =>
    <button onClick={onClick} type="button">
        {children}
    </button>;

const Table = ({ list, pattern }) =>
    <div className="table">
        { list.filter(isSearched(pattern)).map((item) =>
            <div key={item.objectID} className="table-row"
                 title={item.title+" - "+item.author}>
                <span className="colTitle">
                    <a href={item.url}>{item.title}</a>
                </span>
                <span className="colAuthor">{item.author}</span>
                <span className="colComments">
                     <a href={`${COMMENTS_BASE}${item.objectID}`}>
                         {item.num_comments}
                     </a>
                </span>
                <span className="colPoints">{item.points}</span>
            </div>
        )}
    </div>;

const AppPage = ({greet, children}) =>
    <div className="App">
        <AppHeader hello={greet} tick='3000' />
            <div className="App-body">
                {children}
            </div>
        <AppFooter />
    </div>;

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = props;
        // how long between ticks and tocks, in milliseconds
        this.interval = Number(props.tick);
        const tick = () => this.forceUpdate();    
        setInterval(tick, this.interval);
    }

    render() {
        let now = new Date();
        
        let even = (Number(now)/this.interval).toFixed(0) % 2;
        const { hello } = this.state;
        return(
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>
                    React Tutorial: <em>{hello.replace("_", even ? "HN" : "NH")}</em>
                </h2>
            </div>
        );
    }
}


const AppFooter = () =>
    <p className="App-footer">
        To start, edit <code>src/App.js</code> and save to reload.
    </p>;

export default App;
