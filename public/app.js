/* eslint no-unused-vars: ["warn"] guard-for-in: "off" */
/* global THREE window document requestAnimationFrame Stats dat $ Math*/

var scene;
var camera;
var renderer;
var stats;
var vn; // volcano name and lat/long holder
var url = "/volcano.csv";
var query; // earthquake data
var queryGeom = [];
var originObject; // object to show elevatino of the volcano

$.ajax( {
  url: url,
  cache: false,
  type: 'GET',
  async: false,
  success: function( data ) {
    var v = $.csv.toObjects( data );
    vn = {};
    for( var i = 0; i < v.length; i++ ) {
      vn[v[i].name] = v[i].lat + "," + v[i].long + "," + v[i].elev;
    }
  },
  error: function( xhr, status, err ) {
    console.error( this, status, err.toString() );
  }.bind( this )
} );

init();
animate();

/**
 * The initial function that setups the scene
 */
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer( {
    antialias: true
  } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xf0f0f0 );
  document.body.appendChild( renderer.domElement );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  // var geometry = new THREE.BoxGeometry(1, 1, 1);
  // var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // var cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // ========================================= BOTTOM SQUARS ========================================= //
  var geometry = new THREE.BoxGeometry( 20, 20, 20 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
    color: Math.random() * 0xffffff
  } ) );
  var object2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
    color: Math.random() * 0xffffff
  } ) );
  var object3 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
    color: Math.random() * 0xffffff
  } ) );
  var object4 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
    color: Math.random() * 0xffffff
  } ) );

  object.position.x = 40;
  object.position.y = -100;
  object.position.z = 40;
  scene.add( object );

  object2.position.x = -40;
  object2.position.y = -100;
  object2.position.z = 40;
  scene.add( object2 );

  object3.position.x = 40;
  object3.position.z = -40;
  object3.position.y = -100;
  scene.add( object3 );

  object4.position.x = -40;
  object4.position.y = -100;
  object4.position.z = -40;
  scene.add( object4 );

  var origin = new THREE.BoxGeometry( 1, 1, 1 );
  originObject = new THREE.Mesh( origin, new THREE.MeshLambertMaterial( {
    color: Math.random() * 0xffffff
  } ) );
  scene.add( originObject );

  var northObject = new THREE.Mesh( origin, new THREE.MeshLambertMaterial( {
    color: 0xff0000
  } ) );
  northObject.position.x = 100;
  scene.add( northObject );

  // for( var i = 0; i < 1500; i++ ) {
  //   var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
  //     color: Math.random() * 0xffffff
  //   } ) );
  //
  //   object.position.x = Math.random() * 800 - 400;
  //   object.position.y = Math.random() * 800 - 400;
  //   object.position.z = Math.random() * 800 - 400;
  //
  //   scene.add( object );
  // }

  // ========================================= PLANE ========================================= //
  var planeGeometry = new THREE.SphereGeometry( 100, 50, 50 );
  planeGeometry.scale( 1, .01, 1 );
  var planeMaterial = new THREE.LineBasicMaterial( {
    color: 65532,
    opacity: 0.25,
    transparent: true,
    alphaTest: 0.25
  } );
  var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );

  scene.add( planeMesh );

  // ========================================= LIGHTS ========================================= //
  scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

  var light = new THREE.DirectionalLight( 0xffffff, 0.35 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  camera.position.z = 5;

  // ========================================= STATS MONITOR ========================================= //
  stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  // ========================================= GUI ========================================= //
  var TextObject = {
    Latitude: 34.5,
    Longitude: 131.6,
    Elevation: 571,
    startDate: 2000,
    endDate: 2010,
    startMonth: 1,
    endMonth: 12,
    startDay: 1,
    endDay: 30,
    startHour: 0,
    endHour: 0,
    startMin: 0,
    endMin: 0,
    startSec: 0,
    endSec: 0,
    play: 0,
    radiusDegrees: 5,
    VolcanoName: "34.5,131.6,571",
    dateGet: function( val ) {
      if( val === 0 )
        return this.startDate.toString() + "%2D" + this.startMonth.toString() + "%2D" + this.startDay.toString();
      return this.endDate.toString() + "%2D" + this.endMonth.toString() + "%2D" + this.endDay.toString();
    },
    timeGet: function( val ) {
      if( val === 0 )
        return this.startHour.toString() + "%3A" + this.startMin.toString() + "%3A" + this.startSec.toString();
      return this.endHour.toString() + "%3A" + this.endMin.toString() + "%3A" + this.endSec.toString();
    },
    sendQuery: function() {
      $( ".loading" ).css( "display", "block" );
      var s = "&starttime=" + this.dateGet( 0 ).toString() + "T" + this.timeGet( 0 ).toString() +
      "&endtime=" + this.dateGet( 1 ).toString() + "T" + this.timeGet( 1 ) +
      "&latitude=" + this.Latitude + "&longitude=" + this.Longitude + "&maxradius=" + this.radiusDegrees;
      console.log( s );
      s = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=csv" + s;
      console.log( s );
      var ref = this;
      $.ajax( {
        url: s,
        type: 'GET',
        async: false,
        success: function( data ) {
          query = $.csv.toObjects( data );
          // TODO get rid of this console.log
          console.log( query );
          createEarthquakes( ref );
        },
        error: function( xhr, status, err ) {
          console.error( this, status, err.toString() );
        }.bind( this )
      } );
    }
  };

  var dateCheck = function( month ) {
    if( month === null )
      return 1;
    else if( month === 2 )
      return 28;
    else if( month <= 7 && month % 2 !== 0 )
      return 31;
    else if( month <= 7 )
      return 30;
    else if( month >= 8 && month % 2 === 0 )
      return 31;
    return 30;
  };

  var gui = new dat.GUI();
  var text = TextObject;

  // ==== QUERY FOLDER ==== //
  var dataFolder = gui.addFolder( 'Data Query' );

  // == latitude == //
  dataFolder.add( text, "Latitude", -90, 90 ).step( 0.01 ).listen();
  dataFolder.add( text, "Longitude", -180, 180 ).step( 0.01 ).listen();
  dataFolder.add( text, "Elevation", -6000, 6000 ).step( 0.01 ).listen();
  dataFolder.add( text, "VolcanoName", vn ).onChange( function( value ) {
    var temp = value.split( "," );
    text.Latitude = Number( temp[0] );
    text.Longitude = Number( temp[1] );
    text.Elevation = Number( temp[2] );
  } );
  dataFolder.add( text, "radiusDegrees" ).min( 0.1 ).max( 180 );

  // == YEAR == //
  var yearFolder = dataFolder.addFolder( 'Year' );
  yearFolder.add( text, 'startDate', 1995, 2016 ).step( 1 ).listen().onChange( function( value ) {
    // console.log(require('util').inspect(this, {depth: null}));
    if( text.endDate < value )
      text.endDate = value;
  } );
  yearFolder.add( text, 'endDate', 1995, 2016 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startDate > value )
      text.startDate = value;
  } );

  // == MONTH == //
  var monthFolder = dataFolder.addFolder( 'Month' );
  monthFolder.add( text, 'startMonth', 1, 12 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startDate === text.endDate && text.endMonth < value )
      text.endMonth = value;
    if( text.startDay >= 29 )
      text.startDay = dateCheck( text.startMonth );
  } );
  monthFolder.add( text, 'endMonth', 1, 12 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startDate === text.endDate && text.startMonth > value )
      text.startMonth = value;
    if( text.endDay >= 29 )
      text.endDay = dateCheck( text.endMonth );
  } );

  // == DAY == //
  var dayFolder = dataFolder.addFolder( 'Day' );
  dayFolder.add( text, 'startDay', 1, 31 ).step( 1 ).listen().onChange( function( value ) {
    if( value >= 29 )
      text.startDate = dateCheck( text.startMonth );
    if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.endDay < value )
      text.endDay = value;
  } );
  dayFolder.add( text, 'endDay', 1, 31 ).step( 1 ).listen().onChange( function( value ) {
    if( value >= 29 )
      text.endDay = dateCheck( text.endMonth );
    if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay > value )
      text.startDay = value;
  } );

  // == HOUR == //
  var hourFolder = dataFolder.addFolder( 'Hour' );
  hourFolder.add( text, 'startHour', 0, 24 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay && text.endHour < value )
      text.endHour = value;
    if( value === 24 ) {
      text.startMin = 0;
      text.startSec = 0;
      if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay ) {
        text.endMin = 0;
        text.endSec = 0;
      }
    }
  } );
  hourFolder.add( text, 'endHour', 0, 24 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay && text.startHour > value )
      text.startHour = value;
    if( value === 24 ) {
      text.endMin = 0;
      text.endSec = 0;
      if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay ) {
        text.startMin = 0;
        text.startSec = 0;
      }
    }
  } );

  // == MIN == //
  var minFolder = dataFolder.addFolder( 'Minute' );
  minFolder.add( text, 'startMin', 0, 60 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startHour === 24 )
      text.startMin = 0;
    else if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay &&
      text.startHour === text.endHour && text.endMin < value )
      text.endMin = value;
  } );
  minFolder.add( text, 'endMin', 0, 60 ).step( 1 ).listen().onChange( function( value ) {
    if( text.endHour === 24 )
      text.endMin = 0;
    else if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay &&
      text.startHour === text.endHour && text.startMin > value )
      text.startMin = value;
  } );

  // == Sec == //
  var secFolder = dataFolder.addFolder( 'Second' );
  secFolder.add( text, 'startSec', 0, 60 ).step( 1 ).listen().onChange( function( value ) {
    if( text.startHour === 24 )
      text.startSec = 0;
    else if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay &&
      text.startHour === text.endHour && text.startMin === text.endMin && text.endSec < value )
      text.endSec = value;
  } );
  secFolder.add( text, 'endSec', 0, 60 ).step( 1 ).listen().onChange( function( value ) {
    if( text.endHour === 24 )
      text.endSec = 0;
    else if( text.startDate === text.endDate && text.startMonth === text.endMonth && text.startDay === text.endDay &&
      text.startHour === text.endHour && text.startMin === text.endMin && text.startSec > value )
      text.startSec = value;
  } );

  dataFolder.add( text, 'sendQuery' );

  // ==== ANIMATION CONTROLLER FOLDER ==== //
  var animFolder = gui.addFolder( 'Animation' );

  // == Controls == //
  animFolder.add( text, 'play' );

  // ========================================= EVENTS ========================================= //
  window.addEventListener( 'resize', onResize, false );
}

/**
 * This funciton will remove everyobject in the geo query array from the scene
 */
function cleanGeo() {
  for( var i = 0; i < queryGeom.length; i++ ) {
    var temp = queryGeom[i];
    scene.remove( temp );
    temp.geometry.dispose();
  }
  queryGeom = [];
}

/**
 * This function's purpose is to create the objects for the three.js canvas
 * @param  {Object} ref contains all the values the user inputs into the dat gui
 */
function createEarthquakes( ref ) {
  // EACH DEGREE IS 111km

  cleanGeo();
  console.log( 'base : ' + ref.radiusDegrees + " " + ref.Latitude + " " + ref.Longitude );

  var geometry = new THREE.SphereGeometry( 1, 50, 50 );
  for( var i = ( query.length - 1 ); i >= 0; i-- ) {
    var mat = new THREE.LineBasicMaterial( {
      color: Math.random() * 0xffffff,
      opacity: 1.0,
      transparent: true,
      alphaTest: 0
    } );
    var earthquake = new THREE.Mesh( geometry, mat );

    // TODO Compress these math equation
    var xOrigin = ref.Latitude;
    var difX = query[i].latitude - xOrigin;
    var max = ref.radiusDegrees;
    var xAcutal = ( difX < 0 ? -1 : 1 ) * ( Math.abs( difX ) * 100 / max );

    var zOrigin = ref.Longitude;
    var difZ = query[i].longitude - zOrigin;
    var zAcutal = ( difZ < 0 ? -1 : 1 ) * ( Math.abs( difZ ) * 100 / max );

    var yOrigin = 0;
    var difY = query[i].depth - yOrigin;
    var maxY = 6000;
    var yAcutal = ( difY < 0 ? -1 : 1 ) * ( Math.abs( difY ) * 100 / maxY );

    earthquake.position.x = xAcutal;
    earthquake.position.z = zAcutal;
    earthquake.position.y = yAcutal;

    // if( xAcutal > 100 || zAcutal > 100 ) {
    //   console.log( xAcutal + " " + zAcutal );
    //   console.log( query[i].latitude );
    //   console.log( query[i].longitude );
    // }

    scene.add( earthquake );
    queryGeom.push( earthquake );
  }

  var difV = ref.Elevation;
  var maxV = 6000;
  var vAcutal = ( difV < 0 ? -1 : 1 ) * ( Math.abs( difV ) * 100 / maxV );

  originObject.position.y = vAcutal;

  renderer.render( scene, camera );
  $( ".loading" ).css( "display", "none" );
}

/**
 * Window resize event
 */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * the animate function
 */
function animate() {
  requestAnimationFrame( animate, renderer.domElement );

  render();
  stats.update();
}

/**
 * This will create a loop that causes the renderer to draw the scene 60 times per second
 */
function render() {
  renderer.render( scene, camera );
}
