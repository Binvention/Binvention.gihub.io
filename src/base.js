import React from "react";
import {hot} from "react-hot-loader";
import Clock from "./projects/clock";
import Sudoku from "./projects/sudokuApp";
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
      this.state={};
      this.state.board = [
         [7,2,3,0,0,0,1,5,9],
         [6,0,0,3,0,2,0,0,8],
         [8,0,0,0,1,0,0,0,2],
         [0,7,0,6,5,4,0,2,0],
         [0,0,4,2,0,7,3,0,0],
         [0,5,0,9,3,1,0,4,0],
         [5,0,0,0,7,0,0,0,3],
         [4,0,0,1,0,3,0,0,6],
         [9,3,2,0,0,0,7,1,4]
         ];
   }
   save(image){
   }
   render(){
      return (<div>
         <Menu/>
         <div className="mainPage">
         <h1>This website is currently under construction</h1>
         <h4>as such I ask your understanding in anything that does not function as desired or look as expected</h4>
            <Sudoku/>
         </div>
      </div>);
   }
}

export default hot(module)(Base);