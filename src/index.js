import React from "react";
import Clock from "./projects/clock.js";
export default class App extends React.Component{
   constructor(props){
      super(props);
   }
   save(image){
   }
   render(){
      return (<div>
         <div id="menu">
         
         </div>
         <div style={{display:"none"}}>
            <Clock radius={50}></Clock>
         </div>
      </div>);
   }
}
ReactDOM.render(App,document.getElementById("root"))