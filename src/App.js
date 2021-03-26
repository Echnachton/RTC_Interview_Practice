import React from "react";
import {Title, Create, Join, Game} from "./components"

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      curr:0,
      list:[
        <Title ch={this.changeState}/>,
        <Create ch={this.changeState}/>,
        <Join ch={this.changeState}/>,
        <Game ch={this.changeState}/>
      ]
    }
  }

  changeState = state =>{
    this.setState({curr:state});
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

// constructor(props){
//   super(props);
//   this.state = {peerId: null, pool:null};
// }

// handleNetwork(){
//   this.handlePeer();
// }

// handlePeer(){
//   //peer connection
//   const peer = new Peer();
//   peer.on('open', async id => {
//     this.setState({peerId:id});
//     console.log("state set");
//     this.handleSockets();
//   });
// }

// handleSockets(){
//   //socketConnection
//   socket.emit("getPool",null);
//   socket.on("poolUpdate", data =>{
//     this.setState({pool:data});
//   });
// }

// createRoom(){
//   document.querySelector("button").setAttribute("disabled","");
//   socket.emit("createRoom",socket.id);
// }

// componentDidMount(){
//   if("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices){
//     navigator.mediaDevices.getUserMedia({video:true, audio:true})
//     .then(mediaStream=>{
//       const video = document.querySelector("video");
//       video.srcObject = mediaStream;
//       video.onloadedmetadata = e => {
//         video.play();
//       };
//       this.handleNetwork();
//     })
//     .catch(err=>console.log(err));
//   }
// };

// render(){
//   return(
//     <>
//     <video muted/>
//     <button onClick={this.createRoom}>Create Room</button>
//     {this.state.pool}
//     </>
//   );
// }