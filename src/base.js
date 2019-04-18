import React from "react";
import {hot} from "react-hot-loader";
import Clock from "./projects/clock";
import "./base.css";

 class Menu extends React.Component{
   constructor(props){
      super(props);
      this.state={};
      }
      render(){
         var menu;
         if(window.innerWidth < 760){
            menu =(<div className="mMenu">
            <img className="icon" src="./static/logo.svg"/>
            <Clock radius={20}></Clock>
            <h1>Brandon Baird</h1>
            </div>)
         } else {
            menu = (<div className="dMenu">
            <img className="icon" src="./static/logo.svg"/>
            <Clock radius={20}></Clock>
            <h1>Brandon Baird</h1>
            <div className="menuButtons">

            </div>
            </div>)
         }
      return (<div className="Menu">
            {menu}
         </div>);
   }
}

class Base extends React.Component{
   constructor(props){
      super(props);
   }
   save(image){
   }
   render(){
      return (<div>
         <Menu/>
         <div className="mainPage">
         </div>
      </div>);
   }
}

export default hot(module)(Base);