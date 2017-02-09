"use scrict";
(() => {
    const Strings = {

        error: 'Fehler'
    }

    class DebouncedInput extends React.Component {
        constructor(props) {
            super(props)

            this.state = {
                value: props.value,
            }

            this.triggerCallback = $.debounce(props.debounceTime, this.triggerCallback);
        }

        updateInputValue(e) {
            let inputField = this.refs.inputfield;
            $(inputField).popover('hide');

            this.setState({
                value: e.target.value
            });

            this.props.onChanged(e.target.value);

        }

        printChange(e) {
            this.triggerCallback();
        }

        triggerCallback(value) {
            this.props.onCommit(this.state.value);
        }

        componentDidMount() {
            let inputField = this.refs.inputfield;
            $(inputField).popover({trigger: 'manual'});
        }
        componentDidUpdate() {
            let inputField = this.refs.inputfield;

            if (this.props.hasError && this.props.message !== '') {
                $(inputField).popover('show');
            } else {
                $(inputField).popover('hide');
            }
        }
        render() {
            return (

            <div className="input-group">
                <span className="input-group-addon" id="basic-addon3">{this.props.title}</span> 
                <input type="text"
                    ref="inputfield"
                    data-title={this.props.popover.title}
                    data-content={this.props.popover.message}
                    data-placement="left"
                    className="form-control"
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    onChange={this.updateInputValue.bind(this)}
                    onKeyUp={this.printChange.bind(this)}
                    readOnly={this.props.readonly}
                    aria-describedby="basic-addon3"
                />
                {this.props.working ?
                    <span className="input-group-addon">
                        {this.props.working ?
                            <i className="fa fa-spinner fa-spin"></i>
                        : ''}
                        {((this.props.working === false) && this.props.hasError) ?
                            <i className="fa fa-exclamation"></i>
                        :
                            this.props.hasSuccess ? <i className="fa fa-check"></i> : ''
                        }
                    </span>
                : ''}
            </div>
            )
        }
    }

    DebouncedInput.propTypes = {
        title: React.PropTypes.string,
        debounceTime: React.PropTypes.number,
        value: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        hasError: React.PropTypes.bool,
        hasSuccess: React.PropTypes.bool,
        popover: React.PropTypes.object,
        working: React.PropTypes.bool,
        readonly: React.PropTypes.bool,
        onChanged: React.PropTypes.func,
        onCommit: React.PropTypes.func,
    }

    DebouncedInput.defaultProps = {
        debounceTime: 500,
        title: '',
        value: '',
        placeholder: '',
        popover: {title: '', message: ''},
        hasError: false,
        hasSuccess: false,
        working: false,
        readonly: false,
        onChanged: (value) => { return; },
        onCommit: (value) => { return; }
    };

    class App extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                hasError: false,
                hasSuccess: false,
                errorMessage: '',
                working: false,
            }
        }

        onFilterChange(value) {            
            this.setState({
                working: true
            });
            // Query the api            
        }
        
        onFilterCommit(value) {
            let self = this;
            fetch(`query?user=${value}`).then((response) => {
                return response.json();
            }).then(data => {
                self.setState({
                    working: false,
                    data: data
                });                
            })
        }

        render() {            
            let user = (this.state.data && this.state.data.success) ? this.state.data.result : [];
            let hasUser = user.length > 0 ? true : false;            
            return (
                <div class="col-sm-12">
                    <div className="col-sm-12">
                        <DebouncedInput
                            title="ID oder Filter"
                            hasError={this.state.hasError}
                            hasSuccess={this.state.hasSuccess}
                            popover={{title: Strings.error, message: this.state.errorMessage}}
                            working={this.state.working}
                            onCommit={this.onFilterCommit.bind(this)}
                            onChanged={this.onFilterChange.bind(this)}                        
                            readonly={false}
                        />
                    </div>                    
                    <div className="col-sm-12">
                        <h2>Ergebnisse</h2>
                    </div>
                    <div className="col-sm-12">
                        <ul className="list-group">
                            {hasUser ? user.map( (user) => {
                                if (user.online) {
                                    return (<li className="list-group-item">{`${user.member} online seit ${user.online}`}</li>)
                                } else {
                                    return (<li className="list-group-item">{`${user.member} offline seit ${user.offline}`}</li>)
                                }                                
                            }) :
                                <li className="list-group-item">{`Keine Benutzer gefunden`}</li>
                            }                            
                        </ul>
                    </div>
                </div>
            )
        }
    }   

    ReactDOM.render(<App/>, document.getElementById('app'));
})();