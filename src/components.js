import React from "react";
import socketIoClient from "socket.io-client";
import Peer from "peerjs";
import "./component.css";

const ENDPOINT = "http://127.0.0.1:4444";
const socket = socketIoClient(ENDPOINT);

class Title extends React.Component{
    passback = state =>{
        this.props.ch(state);
    }

    render(){
        return(
            <div id="outer-container">
                <div className="inner-container">
                    <button onClick={_=>this.passback(1)}>Create</button>
                    <button onClick={_=>this.passback(2)}>Join</button>
                </div>
            </div>
        );
    }
}

class Create extends React.Component{
    constructor(props){
        super(props);
        this.state = {pool:[null]}
    }

    componentDidMount(){
        socket.emit("getPool",res=>{
            this.setState({pool:res});
        });
        socket.on("poolUpdate", data=>{
            this.setState({pool:data});
        });
    }    

    registerRoom = name =>{
        if(this.state.pool.includes(name)){
            //handle error
        }else{
            socket.emit("registerRoom",name);
        }
    }

    passback = state =>{
        this.props.ch(state);
    }

    render(){
        return(
            <div id="outer-container">
                <div className="inner-container" id="create">
                    <label htmlFor="name">Room Name</label>
                    <input type="text" name="name" id="input"/>
                    <button onClick={_=>{this.registerRoom(document.querySelector("input").value);this.passback(3)}}>Create</button>
                </div>
            </div>
        );
    }
}

class Join extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {pool:null}
    }

    componentDidMount(){
        socket.emit("getPool",res=>{
            this.parse(res);
        });
        socket.on("poolUpdate", data=>{
            this.parse(data);
        });
    }

    parse(res){
        const arr = [];
        for(let el of res){
            arr.push(<div key={el} class="serverContainer">{el}</div>);
        }
        this.setState({pool:arr});
    }

    handelPeer(e){
        socket.emit("join",e.target.textContent);
    }

    render(){
        return(
            <div id="outer-container">
                <div className="inner-container" id="join">
                    {this.state.pool}
                    <div className="serverContainer" onClick={e=>this.handelPeer(e)}>dummy</div>
                </div>
            </div>
        );
    }
}

class Game extends React.Component{
    render(){
        return(
            <div id="outer-container">
                <div className="inner-container">
                    game
                </div>
            </div>
        );
    }
}
export {Title, Create, Join, Game};
