import * as THREE from "three"; 

import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

let camera, controls, scene, renderer, effect;

let sphere, plane;

const start = Date.now();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    const pointLight1 = new THREE.PointLight( 0xffffff );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    const pointLight2 = new THREE.PointLight( 0xffffff, 0.25 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );

    const loader = new THREE.FontLoader();

    loader.load('https://cdn.skypack.dev/three@0.132.2/examples/fonts/optimer_regular.typeface.json', function ( f ) {
        let geom = new THREE.TextGeometry('das amt', {
        font: f,
        size: 150,
        height: 10,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
        })
        sphere = new THREE.Mesh( geom, new THREE.MeshPhongMaterial( { flatShading: true } ) );
        const bounds = new THREE.Box3().setFromObject(sphere);
        console.log(bounds.max)
        sphere.position.x = -bounds.max.x/2
        scene.add( sphere );
    })


    // Plane

    const planeSize = 800
    plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize /2 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
    plane.position.y = - 200;
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    effect = new AsciiEffect( renderer, ' :*@#', { invert: false } );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    document.body.appendChild( effect.domElement );

    controls = new TrackballControls( camera, effect.domElement );

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    controls.update();

    effect.render( scene, camera );

}