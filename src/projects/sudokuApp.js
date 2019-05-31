import React from "react";
import {default as Sudoku} from "./sudoku.js";

export default class SudokuApp extends React.Component{
   constructor(props){
      super(props);
      console.log(this);
      this.state={
         dbActive:false, 
         list:[], 
         showPossible:false,
         create:false,
         solve:false
      };
      this.keyList=[];
      this.fileInput = React.createRef();
      this.db = this.openDB().then((db)=>{
         this.updateBoards().then((ev)=>{
            this.getBoards().then((boards)=>{
               this.boards=boards;
               console.log(this.boards);
               this.setState({list:this.boards.map((item)=>{
                  return (<Sudoku 
                     height={200} 
                     width={200} 
                     index={item.name} 
                     board={item.board} 
                     editable={false}
                     select = {this.selectBoard.bind(this)}
                  ></Sudoku>);
               })});
               this.getActive().then((index)=>{
                  this.setState({active:index});
               });
            });
         },(err)=>{
            console.log(err);
         });
         this.setState({dbActive:true});
      },(err)=>{
         console.log(err);
         this.setState({dbActive:false});
         this.db = 0;
      });
   }
   getActive(){
      var prom = new Promise((res,rej)=>{
         var active = this.db.transaction("data","readwrite").objectStore("data").get("active");
         active.onsuccess = (event)=>{
            var index = active.result;
            res(index);
         };
      });
      return prom;
   }
   updateBoards(){
      var up= new Promise((resolve,reject)=>{
         fetch("./static/sudoku.json")
            .then(res => res.json())
            .then(
               (result) => {
                  var transaction = this.db.transaction("boards","readwrite").objectStore("boards");
                  transaction.oncomplete = resolve;
                  transaction.onerror = reject;
                  transaction.onabort = reject;
                  transaction.getAllKeys().onsuccess = (event)=>{
                     this.keyList = event.target.result;
                     console.log(this.keyList);
                     for(var i = 0; i < result.length; i++){
                        if(!this.keyList.includes(result[i].name)){
                           this.keyList.push(result[i].name);
                           console.log(result[i],this.keyList);
                           for(var row = 0; row < 9; row++){
                              result[i].board[row]= result[i].board[row].map((item)=>{
                                 return [item,!item];
                              });
                           }
                           transaction.put(result[i].board, result[i].name);
                        }
                     }
                  };
                  resolve(transaction);
               },
               (error) => {
                  console.log(error);
               }
            );
      });
      return up;
   }
   getBoard(h, w, index, editable){
      editable = editable || false;
      var sudoku;
      if(this.state && this.state.dbActive && this.db){
         sudoku = new Promise((res,rej)=>{
            var dboard = this.db.transaction("boards","readwrite").objectStore("boards").get(index);
            dboard.onsuccess = (event)=>{
               res;
            };
         });
      }else{
         sudoku = Promise.resolve(<Sudoku height={h} width={w} index={index}></Sudoku>);
      }
      var db = this.db;
      var tx = db.transaction('boards', 'readonly');
      var store = tx.objectStore('boards');
      var c = store.getAll();
      console.log(c);
      return sudoku;
   }
   openDB(){
      this.db;
      var pDB = new Promise(function(resolve,reject){
         var request = indexedDB.open("Sudoku");
         request.onerror = function(event) {
            alert("Database not supported. Sudoku boards will not be saved in browser");
            reject(0);
         };
         request.onsuccess = function(event) {
            this.db = event.target.result;
            resolve(this.db);
         }.bind(this);
         request.onupgradeneeded = function(event){
            console.log(event);
            this.db = event.target.result;
            if(!this.db.objectStoreNames.contains("boards")){
               var boards = this.db.createObjectStore("boards");
               boards.add([
                  [7,2,3,0,0,0,1,5,9],
                  [6,0,0,3,0,2,0,0,8],
                  [8,0,0,0,1,0,0,0,2],
                  [0,7,0,6,5,4,0,2,0],
                  [0,0,4,2,0,7,3,0,0],
                  [0,5,0,9,3,1,0,4,0],
                  [5,0,0,0,7,0,0,0,3],
                  [4,0,0,1,0,3,0,0,6],
                  [9,3,2,0,0,0,7,1,4]
               ].map((item)=>{
                  return item.map((a)=>{
                     return [a,!a];
                  });
               }),"default");
            }else{
               //event.target.transaction.objectStore("board");
            }
            if(!this.db.objectStoreNames.contains("data")){
               var data = this.db.createObjectStore("data");
               data.add("default","active");
            }else{
               //event.target.transaction.objectStore("data");
            }
         }.bind(this);
      }.bind(this));
      return pDB;
   }
   saveBoard(sudoku,box){
      if(sudoku && box)
      {
         this.boards[this.keyList.indexOf(sudoku.dbindex)].board[box.coord.row][box.coord.columb][0] = box.value;
         var db = this.db;
         var result;
         if(db){
            result = new Promise((res,rej)=>{
               console.log("saving board");
               db.transaction("boards","readwrite").objectStore("boards").put(sudoku.board.storagePrep(),sudoku.dbindex);
            });
         }else{
            result = Promise.reject("Database not supported");
         }
      }else{
         result = Promise.reject("Unable to save board");
      }
      return result;
   }
   getBoards(db){
      db = db || this.db;
      return new Promise((res,rej)=>{
         var boards = [];
         db.transaction("boards","readonly")
            .objectStore("boards")
            .openCursor()
            .onsuccess = (event)=>{
               var cursor = event.target.result;
               if(cursor){
                  var board = cursor.value;
                  boards.push({name:cursor.key,board:board});
                  cursor.continue();
               }else{
                  res(boards);
               }
            };

      });
   }
   selectBoard(index){
      if(!this.state.custom){
         var db = this.db;
         console.log(index);
         this.setState({active:index,solve:false});
         var result;
         if(db){
            result = new Promise((res,rej)=>{
               db.transaction("data","readwrite").objectStore("data").put(index,"active");
            });
         }else{
            result = Promise.reject("Database not supported");
         }
      }else{
         result = Promise.reject("Cannot select other boards in design mode");
      }
      return result;
   }
   readBoard(){
      var file = this.fileInput.current.files[0];
      var reader = new FileReader();
      reader.onload = function(event){
         var boardName = file.name.split(".")[0] + "custom";
         var board = event.target.result.split('\n');
         for(var i = 0; i < board.length; i++){
            board[i] = board[i].split(' ').map((item)=>{
               return Number(item);
            });
         }
         console.log(board,event);
         if(this.keyList.incudes(boardName)){
            var index = this.keyList.indexOf(boardName);
            this.boards[index].board = board;
         }else{
            this.boards.push({name:file,board:board});
         }
         this.setState({list:this.boards.map((item)=>{
            return (<Sudoku 
               height={200} 
               width={200} 
               index={file} 
               board={board} 
               boardupdate={this.saveBoard.bind(this)} 
               editable={false}
               select = {this.selectBoard.bind(this)}
            ></Sudoku>);
         })});
         if(this.db){
            console.log(file);
            this.db.transaction("boards","readwrite").objectStore("boards").put(board,file.name.split(".")[0] + "-custom");
         }
         this.selectBoard(file.name.split(".")[0] + "-custom");
      }.bind(this);
      reader.readAsText(file);
      this.selectBoard(file);
   }
   showPossible(){
      this.setState({showPossible:!this.state.showPossible});
   }
   createBoard(){
      var blank = [
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0],
         [0,0,0,0,0,0,0,0,0]
      ];
      var makeCustom = this.makeCustom.bind(this);
      this.creative = (<Sudoku 
         height={540} 
         width={540} 
         index={"create"} 
         board={blank} 
         boardupdate={makeCustom} 
         editable={true}
         showPossibles={true}
         solve={false}
      ></Sudoku>);
      this.setState({create:true});
   }
   makeCustom(sudoku){
      console.log(sudoku,this);
      this.customBoard = sudoku.board.storagePrep();
   }
   saveCustom(){
      console.log(this.customBoard);
   }
   solveActive(){
      this.setState({solve:true});
   }
   render(){
      var active;
      var list;
      if(this.state){
         list = this.state.list.map(((el)=>{
            return (<li 
               key={
                  el.props.index.toString()
               }
               style={{
                  //display:"inline-block"
               }}
            >{el}</li>);
         }));
         if (this.state.active && 
            this.state.list && !this.state.create){
            var keyArray = this.keyList;
            if(keyArray.includes(this.state.active)){
               var index = keyArray.indexOf(this.state.active);
               active  = React.cloneElement(this.state.list[index],{
                  width:540,
                  height:540,
                  editable:true,
                  showPossibles:this.state.showPossible,
                  solve:this.state.solve,
                  key:this.state.active + this.state.showPossible + this.state.solve,
                  board:this.state.list[index].props.board,
                  boardupdate:this.saveBoard.bind(this)
               });
            }
         }else if(this.state.create){
            active = this.creative;
         }
      }
      var create = (this.state.create ? (<div>
         Name: <input type="text" placeholder="Custom"/><br/>
         <button onClick={this.saveCustom.bind(this)}>Save</button>
      </div>):(<div>
         <button onClick={this.showPossible.bind(this)}>Show Possible Values</button>
         <button onClick={this.solveActive.bind(this)}>Solve Board</button>
         <button onClick={console.log}>Clear Board</button>
         <br/>
         <input type="file" ref={this.fileInput} onChange={this.readBoard.bind(this)} />
         <button onClick={this.createBoard.bind(this)}>Create Custom Board</button>
      </div>)
      );
      return (
         <div style={{
            display:"inline"
         }}>
            <div style={{float:"left"}}>
               {active}
               <div style={{display:"inline-block", float:"left", clear:"both"}}>
                  {create}
               </div>
            </div>
            <ul style={{display:"inline-block", listStyleType:"none", float:"right"}}>
               {list}
            </ul>
         </div>
      );
   }
}