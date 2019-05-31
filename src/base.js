import React,{Suspense} from "react";
import {hot} from "react-hot-loader";
import Clock from "./projects/clock";
import "./base.css";
import AboutMe from "./projects/aboutMe";
//import Sudoku from "./projects/sudokuApp";
const Sudoku = React.lazy(()=>import(/* webpackChunkName: "sudoku" */ "./projects/sudokuApp"));

class Base extends React.Component{
   constructor(props){
      super(props);
      this.state={};
      this.state.active = (<AboutMe/>)
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
      if(window.innerWidth < 760 && false){
         this.menu =(<div className="mMenu Menu">
         <img className="icon" src="./static/logo.svg"/>
         <Clock radius={20}></Clock>
         <h1>Brandon Baird</h1>
         </div>)
      } else {
         this.menu = (<div className="dMenu Menu">
         <img className="icon" src="./static/logo.svg"/>
         <Clock radius={20}></Clock>
         <h1>Brandon Baird</h1>
         <div className="menuButtons">
         <div className="button" onClick={this.openAboutMe.bind(this)}>About Me</div>
         <div className="button" onClick={this.openSudoku.bind(this)}>Sudoku</div>
         </div>
         </div>)
      }
   }
   openSudoku(){
      this.setState({active : (<Sudoku/>)});
   }
   openAboutMe(){
      this.setState({active:(<AboutMe/>)});
   }
   render(){
      return (<div>
         {this.menu}
         <div className="mainPage">
         <h1>This website is currently under construction</h1>
         <h4>as such I ask your understanding in anything that does not function as desired or look as expected</h4>
            <Suspense fallback={<div>Loading...</div>}>
               {this.state.active}
            </Suspense>
         </div>
      </div>);
   }
}

export default hot(module)(Base);