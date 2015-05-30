//MapRags receives 2 sets of arguments
// "el", "map", where map is a 2d array or....
// "el", "map", "n", "m", where map is a 1d array and n and m are the numbers of rows and cols...
var MapRags = function (el, map, n, m, scale){

  if (!map[0].length && (!n || !m)) {
    alert('Inititalization error. Checks the logs.');
    console.log('1D array needs number of cols and rows. Usage:');
    console.log('new MapRags(map, rows, cols)');
    return;
  }

  this.el = el;

  //flatten 2d array
  if (!!map[0].length) {
    this.n = map.length;
    this.m = map[0].length; 
    this.update2D(map);
    //1d array init
  } else {
    this.n = n;
    this.m = m; 
    this.map =  map;
  }

  this.c1 = [255, 255, 255];
  this.c2 = [255, 42, 0];

  if (scale && scale.max !== undefined && scale.min !== undefined){ 
    this.max = scale.max;
    this.min = scale.min;
    return;
  }

  //If scale is undefined, get max and min from map
  this.max = Math.max.apply(null, this.map);
  this.min = Math.min.apply(null, this.map);
  
};

MapRags.prototype.update2D = function (map) {
  var map1d = [];
  this.map =  map1d.concat.apply([], map);
}

MapRags.prototype.render = function () {

  var canvas = document.getElementById(this.el);

  if (canvas.getContext){

    var ctx = canvas.getContext('2d');

    this.w = canvas.width;
    this.h = canvas.height;

    var n = this.n;
    var m = this.m;


    for (var i = 0; i < n; i++) {
      for (var j = 0; j < m; j++) {


        if (typeof this.map[i*this.m + j] !== "number") {
          throw 'Array element is not a number'
        }

        if (this.map[i*this.m + j] === Infinity){
          ctx.fillStyle = "rgb(0,0,0)";
        } else {
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
        }

        var dx = Math.floor(this.w / this.m);
        var dy = Math.floor(this.h / this.n);

        var y = dx * i;
        var x = dy * j;

        ctx.fillRect (x, y, dy, dx);

      }
    }
  }
};  

MapRags.prototype.updateMap = function (map) {
  this.update2D(map);
}