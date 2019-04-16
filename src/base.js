import React from "react";
import {hot} from "react-hot-loader";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
            menu =(<div className="mMenu"><IconButton className="menuButton" color="inherit" aria-label="Menu">
                  <MenuIcon />
               </IconButton></div>)
         } else {
            menu = (<div className="dMenu"><Button>Hello</Button><Button>World</Button></div>)
         }
      return (
         <div className="Menu">
            <AppBar position="static">
               <Toolbar>
                  <h4>Brandon Baird</h4>
                  {menu}
               </Toolbar>
            </AppBar>
         </div>
      );
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
         <div >
            <Clock radius={50}></Clock>
            <img src="../static/logo.svg"/>
         </div>
      </div>);
   }
}

export default hot(module)(Base);