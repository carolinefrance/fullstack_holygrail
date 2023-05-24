/* public/index.js
** Front-end functionality & requests to DB
*/

/* PlusMinus function = React component that renders two images, representing a plus and a minus button. It takes in a props object, which should contain section (the name of the content section) and handle (a function to handle button clicks). When a button is clicked, the handle function is called with the appropriate section name and a value of -1 for the minus button or 1 for the plus button. */
function PlusMinus(props){
    function handle(e){
        if(e.target.id.includes('minus')){
            props.handle({name:props.section, value: -1});
            return;    
        }
        props.handle({name:props.section, value: 1});    
    }
    return (<>
        <img src={`icons/${props.section}_plus.png`} id="plus" onClick={((e) => handle(e))}/>
        <img src={`icons/${props.section}_minus.png`} id="minus" onClick={((e) => handle(e))}/>
    </>);
}
/* Data function = React component that renders a div element displaying the values of different data sections. It takes in a props object, which should contain data with properties for header, left, article, right, and footer. The values of these properties are displayed in the rendered div. */
function Data(props){
    return (<div>
        Header:  {props.data.header}, 
        Left:    {props.data.left}, 
        Article: {props.data.article}, 
        Right:   {props.data.right}, 
        Footer:  {props.data.footer}
    </div>);
}
/* update function = makes an HTTP request to update the DB. It takes in the name of the section to update and value to update the section with. It returns a promise that resolves with the response body if the request is successful, or rejects with null if there is an error. */
function update(section, value) {
    return new Promise((resolve, reject) => {
        var url = `/update/${section}/${value}`;        
        superagent
            .get(url)
            .end(function(err, res){
                err ? reject(null) : resolve(res.body);
            });
    });
}
/* read function = makes an HTTP request to GET data from the DB. It returns a promise that resolves with the response body (data) if the request is successful, or rejects with null if there is an error. */
function read() {
    return new Promise((resolve, reject) => {
        var url = '/data';
        superagent
            .get(url)
            .end(function(err, res){
                err ? reject(null) : resolve(res.body);
            });
    });
}
/* App function = main React component of the app. */
function App(){
    /* React.useState hook sets up initial state, in which data represents the current values of content sections */
    const [data, setData] = React.useState({header:0,left:0,article:0,right:0,footer:0});    
    /* React.useEffect hook fetches data from the database and update the UI when the component mounts. */
    React.useEffect(() => {
        // reads db data & update UI
        const response = read()
            .then(res => {
                setData(res)
        });        
    }, []);

    /* handle function = handles button clicks and updates the DB and the local state (data). It calls the update function to update the database and then sets the updated data using setData. */
    function handle(section){
        // update db & local state
        const response = update(section.name, section.value)
            .then(res => {
                setData(res)
            });
    }
    /* return statement = renders content sections as child components of a div element with the class name "grid". Each content section component receives the handle function and data as props. */
    return (<>
        <div className="grid">        
            <Header  handle={handle} data={data}/>
            <Left    handle={handle} data={data}/>
            <Article handle={handle} data={data}/>
            <Right   handle={handle} data={data}/>
            <Footer  handle={handle} data={data}/>
        </div>
    </>);
}
/* ReactDOM.render = called to render the App component and mount it to the DOM element with the ID "root" */
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);