(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint no-unused-vars: ["warn"] guard-for-in: "off" */
/* global THREE window document requestAnimationFrame Stats dat $*/

var scene;
var camera;
var renderer;
var stats;
var vn;
var url = "localhost/volcano.csv";

$.ajax( {
  url: url,
  cache: false,
  type: 'GET',
  success: function( data ) {
    vn = $.csv.toObjects( data );
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

  var geometry = new THREE.BoxGeometry( 20, 20, 20 );

  // ============================= WHERE THE OBJECTS ARE ADDED ============================= //
  for( var i = 0; i < 1500; i++ ) {
    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
      color: Math.random() * 0xffffff
    } ) );

    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    scene.add( object );
  }

  // ============================= PLANE ============================= //
  var planeGeometry = new THREE.BoxGeometry( 50, 0.01, 50 );
  planeGeometry.scale( 20, 1, 20 );
  var planeMaterial = new THREE.LineBasicMaterial( {
    color: 65532,
    opacity: 0.25,
    transparent: true,
    alphaTest: 0.25
  } );
  var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );

  scene.add( planeMesh );

  scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

  var light = new THREE.DirectionalLight( 0xffffff, 0.35 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  camera.position.z = 5;

  // ============================= STATS MONITOR ============================= //
  stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  // ============================= GUI ============================= //
  var TextObject = {
    Latitude: 0,
    Longitude: 0,
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
    sendQuery: function() {
      console.log( "clicked" );
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

  var dataFolder = gui.addFolder( 'Data Query' );

  // == latitude == //
  dataFolder.add( text, "Latitude" );
  dataFolder.add( text, "Longitude" );

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

  // ============================= EVENTS ============================= //
  window.addEventListener( 'resize', onResize, false );
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

},{}]},{},[1]);
