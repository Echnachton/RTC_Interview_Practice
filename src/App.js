import React from "react";
import {Title, Game} from "./components"

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      curr:0,
      list:[
        <Title ch={this.changeState} mi={this.setMatchInfo}/>,
        <Game ch={this.changeState} mi={this.getMatchInfo} invertMode={this.invertMode}/>
      ],
      matchInfo:{peer:101, mode:101}
    }
  }

  changeState = state =>{
    this.setState({curr:state});
  }

  getMatchInfo = _=> {
    return this.state.matchInfo;
  }

  setMatchInfo = (peer, mode)=>{
    this.setState({matchInfo:{peer:peer, mode:mode}});
  }

  invertMode = _=>{
    this.state.matchInfo.mode===0 ? this.setState({matchInfo:{peer:this.state.matchInfo.peer, mode:1}}) : this.setState({matchInfo:{peer:this.state.matchInfo.peer, mode:0}});
  }

  render(){
    return(
      <>
        {this.state.list[this.state.curr]}
      </>
    );
  }
}

export default App;