var MapRags = function (map){

  if (map[0].length === undefined) {
    alert('1D array not supported.');
  }
  else {
    this.n = map.length;
    this.m = map[0].length; 
    var map1d = [];
    this.map =  map1d.concat.apply(map1d, map);

    this.c1 = [0, 0, 255];
    this.c2 = [255, 0, 0];

    this.max = Math.max.apply(null, this.map);
    this.min = Math.min.apply(null, this.map);
    
  }
};

MapRags.prototype.render = function (el) {

  var canvas = document.getElementById(el);

  if (canvas.getContext){

    var ctx = canvas.getContext('2d');

    this.w = canvas.width;
    this.h = canvas.height;

    var n = map.length;
    var m = map[0].length;


    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[0].length; j++) {

        var mr = (this.c2[0] - this.c1[0])/(this.max - this.min);
        var mg = (this.c2[1] - this.c1[1])/(this.max - this.min);
        var mb = (this.c2[2] - this.c1[2])/(this.max - this.min);

        var br = this.c1[0] - mr * this.min; 
        var bg = this.c1[1] - mg * this.min;
        var bb = this.c1[2] - mb * this.min;

        var r = Math.round( mr * this.map[i*this.m + j] + br);
        var g = Math.round( mg * this.map[i*this.m + j] + bg);
        var b = Math.round( mb * this.map[i*this.m + j] + bb);

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

        var dx = Math.floor(this.w / this.m);
        var dy = Math.floor(this.h / this.n);

        var x = dx * i;
        var y = dy * j;

        ctx.fillRect (x, y, dx, dy);

      }
    }
  }
};  