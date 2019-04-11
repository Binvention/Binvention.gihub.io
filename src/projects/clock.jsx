import React from 'react';
class Clock extends React.Component {
   constructor(props){
      super(props);
      this.canvas= React.createRef();
      this.height = props.radius * 2 || 50;
      this.width = this.height;
      this.backgroungcolor= "transparent";
   }
   componentDidMount(){
      this.canvas.current.height = this.height;
      this.canvas.current.width = this.width;
      console.log(this);
      var ctx = this.canvas.current.getContext("2d");
      var radius = this.height / 2;
      //ctx.setTransform(2,0,0,1,0,0)
      ctx.translate(radius, radius);
      var fill="black";//$element.css('color');
      ctx.fillStyle=fill;
      ctx.strokeStyle=fill;
      console.log(ctx,radius);
      setInterval(drawClock, 1000,ctx,radius);

      function drawClock(ctx,radius) {
         ctx.clearRect(0-radius,0-radius,radius*2,radius*2);
         drawNumbers(ctx, radius);
         drawTime(ctx, radius);
      }

      function drawNumbers(ctx, radius) {
         var ang;
         var num;
         ctx.font = radius*0.4 + "px arial";
         ctx.textBaseline="middle";
         ctx.textAlign="center";
         for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius*0.8);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius*0.8);
            ctx.rotate(-ang);
         }
      }

      function drawTime(ctx, radius){
         var now = new Date();
         var hour = now.getHours();
         var minute = now.getMinutes();
         var second = now.getSeconds();
         //hour
         hour=hour%12;
         hour=(hour*Math.PI/6)+
         (minute*Math.PI/(6*60))+
         (second*Math.PI/(360*60));
         drawHand(ctx, hour, radius*0.5, radius*0.07);
         //minute
         minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
         drawHand(ctx, minute, radius*0.8, radius*0.07);
         // second
         second=(second*Math.PI/30);
         drawHand(ctx, second, radius*0.9, radius*0.02);
      }

      function drawHand(ctx, pos, length, width) {
         ctx.beginPath();
         ctx.lineWidth = width;
         ctx.lineCap = "round";
         ctx.moveTo(0,0);
         ctx.rotate(pos);
         ctx.lineTo(0, -length);
         ctx.stroke();
         ctx.rotate(-pos);
      }
   }

   render(){
      return (<canvas ref={this.canvas} style={{}}></canvas>);
   }
}

export {Clock as default};