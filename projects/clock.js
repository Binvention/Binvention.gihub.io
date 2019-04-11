var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var Clock = function (_React$Component) {
   _inherits(Clock, _React$Component);

   function Clock(props) {
      _classCallCheck(this, Clock);

      var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));

      _this.canvas = React.createRef();
      _this.height = props.radius * 2 || 50;
      _this.width = _this.height;
      _this.backgroungcolor = "transparent";
      return _this;
   }

   _createClass(Clock, [{
      key: "componentDidMount",
      value: function componentDidMount() {
         this.canvas.current.height = this.height;
         this.canvas.current.width = this.width;
         console.log(this);
         var ctx = this.canvas.current.getContext("2d");
         var radius = this.height / 2;
         //ctx.setTransform(2,0,0,1,0,0)
         ctx.translate(radius, radius);
         var fill = "black"; //$element.css('color');
         ctx.fillStyle = fill;
         ctx.strokeStyle = fill;
         console.log(ctx, radius);
         setInterval(drawClock, 1000, ctx, radius);

         function drawClock(ctx, radius) {
            ctx.clearRect(0 - radius, 0 - radius, radius * 2, radius * 2);
            drawNumbers(ctx, radius);
            drawTime(ctx, radius);
         }

         function drawNumbers(ctx, radius) {
            var ang;
            var num;
            ctx.font = radius * 0.4 + "px arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            for (num = 1; num < 13; num++) {
               ang = num * Math.PI / 6;
               ctx.rotate(ang);
               ctx.translate(0, -radius * 0.8);
               ctx.rotate(-ang);
               ctx.fillText(num.toString(), 0, 0);
               ctx.rotate(ang);
               ctx.translate(0, radius * 0.8);
               ctx.rotate(-ang);
            }
         }

         function drawTime(ctx, radius) {
            var now = new Date();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            //hour
            hour = hour % 12;
            hour = hour * Math.PI / 6 + minute * Math.PI / (6 * 60) + second * Math.PI / (360 * 60);
            drawHand(ctx, hour, radius * 0.5, radius * 0.07);
            //minute
            minute = minute * Math.PI / 30 + second * Math.PI / (30 * 60);
            drawHand(ctx, minute, radius * 0.8, radius * 0.07);
            // second
            second = second * Math.PI / 30;
            drawHand(ctx, second, radius * 0.9, radius * 0.02);
         }

         function drawHand(ctx, pos, length, width) {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.moveTo(0, 0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
         }
      }
   }, {
      key: "render",
      value: function render() {
         return React.createElement("canvas", { ref: this.canvas, style: {} });
      }
   }]);

   return Clock;
}(React.Component);

export { Clock as default };