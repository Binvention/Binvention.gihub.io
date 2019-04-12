import React from "react";
import { isNumber, isString } from "util";

class Sudoku extends React.Component {
   constructor(props){
      super(props);
      this.canvas = React.createRef();
      this.fileInput = React.createRef();
      console.log(this);
      this.active;
      this.state = {
         editable : this.props.editable || false,
      };
      this.id = props.id || 0;
      this.height = Number(this.props.height) || 540;
      this.width = Number(this.props.width) || 540;
      this.scalex = this.width / 540 || 1;
      this.scaley = this.height / 540 || 1;
      this.dbindex = this.props.index || "cross";
      this.board = new Board(this.props.board);
      this.state.board = this.board;
   }
   componentDidMount(){ 
      this.canvas.current.width = this.width;
      this.canvas.current.height = this.height;
      var ctx = this.canvas.current.getContext('2d');
      ctx.scale(this.scalex,this.scaley);
      this.ctx = ctx;
      this.display(ctx);   
   }
   componentWillUnmount(){
   }
   clearCanvas(ctx){
      ctx.clearRect(0,0,540,540);
   }
   display(ctx){
      ctx = ctx || this.ctx;
      this.clearCanvas(ctx);
      this.drawSelected(ctx);
      this.drawGrid(ctx);
      this.drawNumbers(ctx);
   }
   drawGrid(ctx){
      for (var i = 0; i <= 9; i++){
         if(i == 0 || i == 3 || i == 6 || i == 9){
            ctx.lineWidth = 3;
         }else{
            ctx.lineWidth = 1;
         }
         ctx.beginPath();
         ctx.moveTo(60 * i,0);
         ctx.lineTo(60 * i,540);
         ctx.stroke();
      }
      for (i = 0; i <= 9; i++){
         if(i == 0 || i == 3 || i == 6 || i == 9){
            ctx.lineWidth = 3;
         }else{
            ctx.lineWidth = 1;
         }
         ctx.beginPath();
         ctx.moveTo(0,60 * i);
         ctx.lineTo(540,60 * i);
         ctx.stroke();
      }
      ctx.lineWidth = 1;
   }

   drawSelected(ctx){
      if(this.active && this.state.editable){
         ctx.fillStyle = "#c7c5c5";
         ctx.fillRect(this.active.location.x -30, this.active.location.y - 30,60,60);
      }
   }

   drawNumbers(ctx){
      var board = this.board;
      for(var i = 0; i < 9; i++){
         for(var j = 0; j < 9; j++){
            if(board[i][j].value){
               ctx.font = '48px serif';
               ctx.textAlign = "center";
               ctx.textBaseline = "middle";
               if(board[i][j].editable && board[i][j].valid){
                  ctx.fillStyle = "#736d6d";
               }else if(board[i][j].editable){
                  ctx.fillStyle = "red";
               }else{
                  ctx.fillStyle = "black";
               }
               ctx.fillText(board[i][j].value,board[i][j].location.x,board[i][j].location.y);
            }else if(this.props.showPossibles){
               this.displayPossibles(ctx,board[i][j]);
            }
         }
      }
   }
   displayPossibles(ctx,box){
      ctx.font = '20px serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#736d6d";
      var translate = [
         {x:-20,y:-20},{x:0,y:-20},{x:20,y:-20},
         {x:-20,y:0},{x:0,y:0},{x:20,y:0},
         {x:-20,y:20},{x:0,y:20},{x:20,y:20}
      ];
      for(var i = 0; i < 9; i++){
         if(box.possibles[i]){
            ctx.fillText(i+1,box.location.x + translate[i].x,box.location.y + translate[i].y);
         }
      }
   }
   showPossibleValues(){
      this.showPossibles = !this.showPossibles; 
      this.display(this.ctx);
   }
   select(event){
      var bounding = this.canvas.current.getBoundingClientRect();
      var x = (event.clientX - bounding.x)/this.scalex;
      var y = (event.clientY - bounding.y)/this.scaley;
      var columb = ((x - (x % 60)) / 60);
      var row = ((y - (y % 60)) / 60);
      if(this.state.editable){
         this.active=(this.board[row][columb]);
         this.display(this.ctx);
      } else if(this.props.select){
         console.log("Board " + this.dbindex + " selected");
         this.props.select(this.dbindex);
      }
   }
   input(event){
      if(this.state.editable){
         var value = Number(event.key);
         if(value && this.active.editable){
            this.active.value = value;
            this.board.computeAllPossibles();
            this.board.validateAll();
            if(this.props.boardupdate){
               this.props.boardupdate(this,this.active);
            }
         }else if((value == 0 || event.keyCode == 8) && this.active.editable){
            this.active.value = 0;
            this.board.computeAllPossibles();
            this.board.validateAll();
            if(this.props.boardupdate){
               this.props.boardupdate(this,this.active);
            }
         }else if(event.keyCode == 37 && this.active.coord.columb != 0){
            this.active = (this.board[this.active.coord.row][this.active.coord.columb - 1]);
         }else if(event.keyCode == 38 && this.active.coord.row != 0){
            this.active = (this.board[this.active.coord.row - 1][this.active.coord.columb]);
         }else if(event.keyCode == 39 && this.active.coord.columb != 8){
            this.active = (this.board[this.active.coord.row][this.active.coord.columb + 1]);
         }else if(event.keyCode == 40 && this.active.coord.row != 8){
            this.active = (this.board[this.active.coord.row + 1][this.active.coord.columb]);
         }
         this.display();
      }
   }
   render(){
      return (
         <div style={{
            display:"inline",
            margin:".5em",
            float:"left"
         }}>
            <div style={{
               display:"inherit",
               float:"left"
            }}>
               <canvas ref={this.canvas} style={{
                  height:this.height,
                  width:this.width
               }} onClick={this.select.bind(this)} onKeyDown={this.input.bind(this)} tabIndex="1">Unable to create Sudoku board</canvas>
            </div>
         </div>
      );
   }
}

class Box {
   constructor(value,coord,editable){
      this.value = value;
      this.coord = coord || {row:0,columb:0};
      this.location = this.getLocation();
      this.boundingBox = this.getBoundingBox();
      this.editable = editable;
      this.valid = true;
   }

   getLocation(){
      var location = {
         x: this.coord.columb * 60 + 30,
         y: this.coord.row * 60 + 30
      };
      return location;
   }

   getBoundingBox(){
      var box = {
         row:{
            max:0,
            min:0
         },
         columb:{
            max:0,
            min:0
         },
         editable: true
      };
      var key = "row";
      for (var i = 0; i < 2; i++){
         if (this.coord[key] < 3){
            box[key].min = 0;
            box[key].max = 2;
         }else if (this.coord[key] < 6){
            box[key].min = 3;
            box[key].max = 5;
         }else{
            box[key].min = 6;
            box[key].max = 8;
         }
         key = "columb";
      }
      return box;
   }
}

class Board extends Array {
   constructor(board){
      super();
      if(isString(board)){
         board = JSON.parse(board);
      }
      board = board || [
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
      for(var i = 0; i < 9; i++){
         this[i] =[];
         for(var j = 0; j<9;j++){
            if (isNumber(board[i][j])){
               this[i][j] = new Box(Number(board[i][j]),{row:i,columb:j},!Number(board[i][j]));
            }else{
               this[i][j] = new Box(Number(board[i][j][0]),{row:i,columb:j},Number(board[i][j][1]));
            }
         }
      }
      this.computeAllPossibles();
      this.valid = true;
      this.dbindex;
   }
   storagePrep(){
      var board = [];
      for(var i = 0; i < 9; i++){
         board[i] = [];
         for(var j = 0; j < 9; j++){
            board[i][j] = [];
            board[i][j][0] = this[i][j].value;
            board[i][j][1] = this[i][j].editable;
         }
      }
      return board;
   }
   computeAllPossibles(){
      for(var i = 0; i < 9; i++){
         for(var j = 0; j < 9; j++){
            this[i][j].possibles = this.computePossibles(this[i][j],false);
         }
      }
   }
   computePossibles(box,verify){
      var possibles = [1,1,1,1,1,1,1,1,1];
      for (var i = 0; i < 9; i++){
         if(i != box.coord.row && this[i][box.coord.columb].value){
            if(!verify || !this[i][box.coord.columb].editable){
               possibles[this[i][box.coord.columb].value -1] = 0;
            }
         }
         if(i != box.coord.columb && this[box.coord.row][i].value){
            if(!verify || !this[box.coord.row][i].editable){
               possibles[this[box.coord.row][i].value -1] = 0;
            }
         }
      }
      for (i = box.boundingBox.row.min; i <= box.boundingBox.row.max; i++){
         for(var j = box.boundingBox.columb.min; j<= box.boundingBox.columb.max; j++){
            if(i != box.coord.row && j != box.coord.columb && this[i][j].value){
               if(!verify || !this[i][j].editable){
                  possibles[this[i][j].value -1] = 0;
               }
            }
         }
      }
      return possibles;
   }
   validate(box){
      box.possibles=this.computePossibles(box,false);
      if(box.value && box.possibles[box.value-1]){
         box.valid = true;
      }else{
         box.valid = false;
      }
      return box.valid;
   }
   validateAll(){
      var valid = true;
      for(var i = 0; i < 9; i++){
         for(var j = 0; j < 9; j++){
            if(!this.validate(this[i][j])){
               valid = false;
            }
         }
      }
      this.valid = valid;
      return valid;
   }
   solve(board){
      board = board || this;
      if(board){
         var solved = 0;
         var sboard = [];
         for(var i = 0; i < 9; i++){
            sboard[i] = [];
            for(var j = 0; j < 9; j++){
               if(board[i][j].editable){
                  sboard[i][j] = this.computePossibles(board[i][j],true);
               }else{
                  solved++;
                  sboard[i][j] = board[i][j].value;
               }
            }
         }
         var guessStack = [];
         while(solved < 81){
            var oSolved = solved;
            solved += alone();
            if(oSolved == solved){
               var g = guess();
               if(g){
                  guessStack.push(g);
                  remove(g.value,g.location.row,g.location.columb,"guess");
               }
               solved++;
            }
         }
         return {solved:solved, solution:sboard};
      }
      function guess(){
         for (var i = 0; i < 9; i++){
            var columb = sboard[i].findIndex((element)=>{
               return !Number.isInteger(element);
            });
            if(columb != -1){
               var attempted = [];
               var value = sboard[i][columb].findIndex((element)=>{
                  attempted.push(1);
                  return element;
               }) + 1;
               return {
                  value:value,
                  location:{row:i,columb:columb},
                  possibles:sboard[i][columb],
                  attempted:attempted,
                  modified:[]
               };
            }
         }
         console.log("we have a problem in our guess");
      }
      function modifyGuess(){
         var undone = 0;
         while(guessStack.length){
            var guess = guessStack.pop();
            if(guess){
               for(var i = guess.modified.length - 1; i >= 0 ; i--){
                  undo(guess.modified[i]);
                  undone++;
               }
               var nValue = guess.value + 1;
               while(nValue <= 9){
                  if(guess.possibles[nValue-1]){
                     var nGuess ={
                        value:nValue,
                        location:{row:guess.location.row,columb:guess.location.columb},
                        possibles:guess.possibles,
                        attempted:guess.attempted,
                        modified:[]
                     };
                     guessStack.push(nGuess);
                     undone--;
                     remove(nGuess.value,nGuess.location.row,nGuess.location.columb,"modify guess");
                     return undone;
                  }else{
                     guess.attempted[nValue - 1] = 1;
                     nValue++;
                  }
               }
            }
         }
      }
      function undo(modified){
         sboard[modified.row][modified.columb] = modified.original;
         for(var i = modified.affected.length -1; i >= 0; i--){
            sboard[modified.affected[i].row][modified.affected[i].columb][modified.affected[i].value -1] = 1;
         }
      }
      function remove(value,row,columb,caller){
         var affected = [];
         var boxMinCol = columb - ((columb) % 3);
         var boxMaxCol = boxMinCol + 2;
         var boxMinRow = row - ((row) % 3);
         var boxMaxRow = boxMinRow + 2;
         for(var i = boxMinRow; i <= boxMaxRow; i++){
            for(var j = boxMinCol; j <= boxMaxCol; j++){
               if(i != row && j != columb && !Number.isInteger(sboard[i][j]) && sboard[i][j][value -1]){
                  affected.push({
                     row:i,
                     columb:j,
                     value:value
                  });
                  sboard[i][j][value - 1] = 0;
               }
            }
         }
         for(i = 0; i < 9; i++){
            if(i != row && !Number.isInteger(sboard[i][columb]) && sboard[i][columb][value -1]){
               sboard[i][columb][value - 1] = 0;
               affected.push({
                  row:i,
                  columb:columb,
                  value:value
               });
            }
            if(i != columb && !Number.isInteger(sboard[row][i]) && sboard[row][i][value -1]){
               sboard[row][i][value - 1] = 0;
               affected.push({
                  row:row,
                  columb:i,
                  value:value
               });
            }
         }
         var guessLength = guessStack.length;
         if(guessLength > 0){
            guessStack[guessLength - 1].modified.push({
               row:row,
               columb:columb,
               original:Array.from(sboard[row][columb]),
               affected:affected
            });
         }
         sboard[row][columb] = value;
      }
      function alone(){
         var asolved = 0;
         var rsolved = 0;
         var csolved = 0;
         var cpossibles = [];
         for(var row = 0; row < 9; row++){
            var rpossibles = [];
            for(var columb = 0; columb < 9; columb++){
               if(!cpossibles[columb]){
                  cpossibles[columb] = [];
               }
               if(!Number.isInteger(sboard[row][columb]) && sboard[row][columb].length != 0){
                  var notAlone = -1;
                  var value = 0;
                  for(var i = 0; i < 9; i++){

                     //record if there is only one possible value
                     if(sboard[row][columb] && sboard[row][columb][i]){
                        notAlone++;
                        value = i + 1;
                     }

                     //record if it is only place in row that can hold value
                     var testRow = rpossibles.findIndex((element)=>{
                        return element.value == i + 1;
                     });
                     if(testRow != -1 && sboard[row][columb][i]){
                        rpossibles[testRow].locations.push({row:row,columb:columb});
                     }else if(sboard[row][columb][i]){
                        rpossibles.push({value: i + 1, locations:[{row:row,columb:columb}]});
                     }

                     //record if it is only place in columb that can hold value
                     var testColumb = cpossibles[columb].findIndex((element)=>{
                        return element.value == i + 1;
                     });
                     if(testColumb != -1 && sboard[row][columb][i]){
                        cpossibles[columb][testColumb].locations.push({row:row,columb:columb});
                     }else if(sboard[row][columb][i]){
                        cpossibles[columb].push({value: i + 1, locations:[{row:row,columb:columb}]});
                     }
                  }

                  //Solve if only one value possible
                  if(!notAlone){
                     remove(value,row,columb,"alone");
                     asolved++;
                  }else if (notAlone == -1){
                     if(guessStack.length){
                        var undone = modifyGuess();
                        return asolved + rsolved + csolved - undone;
                     }else{
                        console.log("we have a problem", value, row, columb, sboard, notAlone,guessStack.length);
                     }
                  }
               }else if (sboard[row][columb].length == 0){
                  console.log("board invalid");
               }
            }
            
            //solve if only place in row
            for(var j = 0; j < rpossibles.length; j++){
               if(rpossibles[j].locations.length == 1 && !Number.isInteger(sboard[rpossibles[j].locations[0].row][rpossibles[j].locations[0].columb])){
                  remove(rpossibles[j].value, rpossibles[j].locations[0].row, rpossibles[j].locations[0].columb,"row");
                  rsolved++;
               }else if (rpossibles[j].locations.length == 0){
                  console.log(rpossibles, board, sboard, "we have a problem");
               }
            }
         }
         for(i = 0; i < 9; i++){
            for(j = 0; j < cpossibles[i].length; j++){
               if(cpossibles[i][j].locations.length == 1 && !Number.isInteger(sboard[cpossibles[i][j].locations[0].row][cpossibles[i][j].locations[0].columb])){
                  remove(cpossibles[i][j].value,cpossibles[i][j].locations[0].row,cpossibles[i][j].locations[0].columb,"columb");
                  csolved++;
               }
            }
         }
         return asolved + rsolved + csolved;
      }
   }
}

export {Sudoku as default,Board};