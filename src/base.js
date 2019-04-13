import React from "react";
import {hot} from "react-hot-loader";
import Clock from "./projects/clock.js";
class Base extends React.Component{
   constructor(props){
      super(props);
   }
   save(image){
   }
   render(){
      return (<div>
         <div id="menu">
         
         </div>
         <div >
            <Clock radius={50}></Clock>
         </div>
      </div>);
   }
}

export default hot(module)(Base);