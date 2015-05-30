//            //N   NE   E  SE  S  SW   W  NW   a   b   c   d   e  f   g  h 
var ncols = [ 0,   1,  1,  1, 0, -1, -1, -1]//, -1,  1, -2,  2, -2, 2, -1, 1];
var nrows = [ -1, -1,  0,  1, 1,  1,  0, -1]//, -2, -2, -1, -1,  1, 1,  2, 2];

var cols = 50;
var rows = 50;

//populate with zeros
var rosmap = rosmap(cols, rows);
var ndist = calcDist(ncols, nrows);


function initmap(cols, rows, value){
  
  var array = new Array(cols*rows);

  for (var i = 0;  i < array.length; i++) {
    array[i] = value;
  }

  array[Math.floor(cols/2) + Math.floor(rows/3)*cols] = 0;

  return array
}

function rosmap(cols, rows){
  
  var array = new Array(cols*rows);

  for (var row = 0;  row < rows; row++) {
    for (var col = 0;  col < cols; col++) {
      
      if ( col > cols/3 && col < cols*2/3){
        if (row < rows*2/3 && row > rows/3){
          array[col + cols*row] = Math.random()*2;
          continue;
        }
      }

      array[col + cols*row] = Math.random();

    }
  }

  return array;
}

function calcDist(ncol, nrow){
  var cellwd = cellht = 1;
  var array = [];
  
  for ( n = 0; n < ncol.length; n++ ){
    array[n] = Math.sqrt ( ncol[n] * cellwd * ncol[n] * cellwd + nrow[n] * cellht * nrow[n] * cellht );
  }

  return array;
}

////////////////////
//Serial
////////////////////
(function () {
  var rags;
  var ignmap = initmap(cols, rows, Infinity);
  var tn = t = 0;

  $(document).ready(function () {
    rags = new MapRags('fgm-serial', ignmap, rows, cols, {max: 50, min: 0}); 
    rags.render();
  });

  function nextIttSerial(){

    t = tn;
    tn = Infinity;


    for ( row = 0; row < rows; row++){
      for ( col = 0; col < cols; col++){
        var idx = col + cols*row;
        
        //If the cell burns only in the future, skips and update tn if necessary
        //finds the minimum tn from the cell's ignition times
        if ( ignmap[idx] > t && tn > ignmap[idx] ){

          tn = ignmap[idx];
          continue;
        } 


        //skip if cell burn time differs from current time
        if ( ignmap[idx] !== t )
          continue;


        //Neighbour loop if map[cell] = t
        for (var n = 0; n < 8; n++){

          //neighbour index calc
          var ncol = col + ncols[n];
          var nrow = row + nrows[n];
          var nidx = ncol + nrow*cols;

          //Check if neighbour is inbound
          if ( !(nrow >= 0 && nrow < rows && ncol >= 0 && ncol < cols))
            continue;

          // skip if cell has already burned
          if ( ignmap[nidx] < t )
            continue;

          igntime = t + ndist[n] / rosmap[idx];


          //Update ignition time
          if(igntime < ignmap[nidx]){
            ignmap[nidx] = igntime;
          }

          //Update tn
          if( igntime < tn )
            tn = igntime;
        }
      }
    }

  }

  var itt = 0;
  (function call(){
    setTimeout(function () {

      nextIttSerial();
      if (itt++ % 10 === 0){

        rags.updateMap(ignmap);
        rags.render();      
      }

      if (tn === Infinity) 
        return;
      
      call();
      
    }, 10);  
  })();
})();

////////////////////
//Parallel
////////////////////
var mp;
(function () {
  var ignmap = initmap(cols, rows, 10);
  mp = ignmap

  var rags = new MapRags('fgm-parallel', ignmap, rows, cols, {max: 50, min: 0}); 

  $(document).ready(function () {
    rags.render();
  });

  function nextIttParallel(){

    for ( row = 0; row < rows; row++){
      for ( col = 0; col < cols; col++){
        var idx = col + cols*row;

        //skip ignition cell
        if (ignmap[idx] === 0)
          continue;

        var minArray = [];
        for (var n = 0; n < 8; n++){

          //neighbour index calc
          var ncol = col + ncols[n];
          var nrow = row + nrows[n];
          var nidx = ncol + nrow*cols;

          //Check if neighbour is inbound
          if ( !(nrow >= 0 && nrow < rows && ncol >= 0 && ncol < cols))
            continue;

          igntime = ignmap[nidx] + ndist[n] / rosmap[nidx];
          minArray.push(igntime);

        }

        var min = Math.min.apply(null, minArray);

        ignmap[idx] = min;

      }
    }

  }

  var itt = 0;
  (function call(){
    setTimeout(function () {

      nextIttParallel();
      if (itt++ % 1 === 0){

        rags.updateMap(ignmap);
        rags.render();      
      }
      
      call();
      
    }, 100);  
  })();
})();
