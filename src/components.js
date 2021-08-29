import React from "react";
import socketIoClient from "socket.io-client";
import Peer from "peerjs";
import "./component.css";
import endpoint from "./env.json";

const ENDPOINT = endpoint.Endpoint;
const peer = new Peer();
const socket = socketIoClient(ENDPOINT);
let peerId;

class Title extends React.Component{
    componentDidMount(){
      peer.on("open", id =>{
          peerId = id;
      });
      peer.on("close",_=>{
        peer.destroy();
      });
      socket.on("nopUpdate", data=>{
        const nop = document.getElementById("nop");
        if(nop != null){
          nop.textContent = `${data} people online`;
        }
      });
    }

    networkHandeler = _=> {
        socket.emit("register",null);
        socket.on("targetPeer", data =>{
            socket.emit("resPeerT", {target:data, peerId:peerId});
        });
        socket.on("selfPeer", data =>{
            socket.emit("resPeerS", {target:data, peerId:peerId});
        });
        socket.on("call",data=>{
            this.props.mi(data,0);
            this.props.ch(1);
        });
        socket.on("ans", data=>{
            this.props.mi(data,1);
            this.props.ch(1);
        });
    }

    spinner(){
      const child = document.getElementById("title");
      const nop = document.getElementById("nop");
      const parent = child.parentNode;
      parent.removeChild(child);
      parent.removeChild(nop);
      parent.appendChild(document.createElement("div")).classList.add("spinner");
    }

    render(){
        return(
            <div id="titleConatiner">
                <div id="title" onClick={_=>{this.networkHandeler();this.spinner();}}>Click to Start</div>
                <div id="nop"></div>
            </div>
        );
    }
}

function QuestionList(props){
  return(
    <>
      <div>Ask your partner about...</div>
      <ul>
        {props.questionArray}
      </ul>
    </>
  );
}

function ListeningList(){
  return(
    <div>Your partner will ask you questions</div>
  );
}

function Comments(){
  return(
    <>
      <div>Give each other comments</div>
      <button onClick={_=>window.location.reload()}>Exit</button>
    </>
  );
}

class Game extends React.Component{

    constructor(props){
      super(props);
      this.state = {isTimerSet:false, questionPoolArray:null, isinterviewFinished:false}
    }

    componentDidMount(){
      socket.on("bootV",_=>{
        document.getElementById("buffer").textContent = "partner has left the chat... taking you back to start";
        socket.disconnect();
        peer.destroy();
        window.setTimeout(_=>{
          this.props.ch(0);
          window.location.reload();
        },3*1000)
      });

      if("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices){
        navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then(mediaStream=>{
          const video = document.querySelector("#self");
          const matchInfo = this.props.mi();
          video.srcObject = mediaStream;
          video.onloadedmetadata = e => {
            video.play();
          };
          peer.on('call', call => {
            call.answer(mediaStream);
            call.on('stream', stream=>this.insertStream(stream));
            call.on("error", err =>this.errorHandler(err));
          });
          peer.on("connection",conn =>{
            conn.on("data",_=>{
              this.setTimer();
            })
          });
          this.setState({questionPoolArray:this.getRandomQuestions()});
          if(matchInfo.mode===0){
            const call = peer.call(matchInfo.peer, mediaStream);
            const conn = peer.connect(matchInfo.peer);
            call.on('stream', stream=>this.insertStream(stream));
            call.on("error", err =>this.errorHandler(err));
            conn.on("open",_=>{
              conn.send("hi");
              this.setTimer();
            });
          }
        })
        .catch(_=>{})
      }
    };

    insertStream = stream =>{
      const vid2 = document.getElementById("other");
      vid2.srcObject = stream;
          vid2.onloadedmetadata = e => {
            vid2.play();
          };
    }

    errorHandler = err => {
      this.props.ch(0);
    }

    setTimer = _=>{
      if(this.state.isTimerSet){return}
      this.setState({isTimerSet:true});
      document.getElementById("cover").style.animationName = "timer";
      window.setTimeout(_=>{
        this.props.invertMode();
        this.forceUpdate();
        this.setSecondTimer();
      },5*60*1000);
    }

    setSecondTimer = _=>{
      const cover = document.getElementById("cover");
      cover.style.animationName = null;
      void cover.offsetHeight;
      cover.style.animationName = "timer";
      window.setTimeout(_=>{
        this.setState({isinterviewFinished:true});
        this.forceUpdate();
      },5*60*1000);
    }

    getRandomQuestions = _=>{
      const questionPool = {
        profile:["themselves", "their passion", "their educational background"],
        motivation:["why they want to work at your company", "what they are looking for in the new position", "why you should hire them", "their career goals"],
        skills:["what they consider to be their weakness", "what they consider to be their strength", "their greatest achievement", "what makes them unique", "what they would do in their first month on the job", "their experience with leadership"],
        cluturalFit:["a challenge or conflict faced at work", "the kind of work environment they prefer", "how their boss and coworkers would describe them", "a disagreement they had with their boss", "if they prefer to take leadership or support their coworkers"],
        workingConditions:["their salary expectations", "their availability"]
      };
      let displayedQuestions = []
      for(let el in questionPool){
        displayedQuestions.push(<li key={el}>{questionPool[el][Math.round(Math.random()*(questionPool[el].length-1))]}</li>);
      }
      return displayedQuestions;
    }

    render(){

      let bufferContent;
      let matchInfo = this.props.mi();
      if(this.state.isinterviewFinished){
        bufferContent = <Comments/>
      }else if(matchInfo.mode===0){
        bufferContent = <QuestionList questionArray={this.state.questionPoolArray}/>;
      }else{
        bufferContent = <ListeningList/>;
      }

      return(
        <>
          <div id="timer">
            <div id="cover"/>
          </div>
          <div id="videoChatContainer">
            <div id="videoContainer">
              <video id="self" muted/>
              <video id="other"/>
            </div>
            <div id="buffer">
              {bufferContent}
            </div>
          </div>
        </>
      );
    }
}
export {Title, Game};
