/**
 * Created by heungseok2 on 2017-03-27.
 */

// *************** import library ****************

var $ = require("jquery");
var THREE = require("three");
var TrackballControls = require("three-trackballcontrols");
var TWEEN = require("tween.js");
var text2D = require("three-text2d");


module.exports = SongNav;

function SongNav(container_id) {
    // This is an API
    return {
        init: init,
        animate: animate

    }

    var container, HEIGHT, WIDTH;

    var scene, camera, renderer, controls;
    var raycaster, intersects;
    var mouse, INTERSECTED;

    var materials = [];
    var fogHex, fogDensity;
    var parameters = {}, parameterCount, particles;


    // for text
    var sprites;
    var PARTICLE_SIZE;

    var cameraTOTarget = false;
    var targetPosition = {
        x: 0,
        y: 0,
        z: 0
    };

    function init(){
        initScene();
        initParticles();
        initRenderer();
    }

    function initScene() {
        container = document.getElementById(container_id);
        // perspectiveCamera(fov: Camera frustum vertical field of view,
        //                   aspect: Camera frustum aspect ratio
        //                   near: Camera frustum near plane. (얼마나 가까이갈수있는지 == 깊게 들어가는지)
        //                   far: Camera frustum far plane. (얼마나 멀리 당겨질수있는가)
        //        camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 0.1, 200000 );
        //        camera.position.z = 2750;
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT , 0.1, 200000);
        camera.position.z = 500;

        controls = new TrackballControls(camera, container);
        controls.rotateSpeed = 0.4;
        controls.zoomSpeed = 0.8;
        controls.panSpeed = 0.5;

        controls.noPan = false;
        controls.noZoom = false;
        controls.noRotate = false;

        controls.staticMoving = false;
        // controls.dynamicDampingFactor = 0.2;

        controls.addEventListener('change', render);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        scene = new THREE.Scene();
        // fogHex = 0x000000; /* As black as your heart.	*/
        // fogDensity = 0.0001; /* So not terribly dense?	*/
        // scene.fog = new THREE.FogExp2(fogHex, fogDensity);
        scene.add(new THREE.AmbientLight(0x444444));

    }



    function initParticles() {

        var geometry = new THREE.Geometry();


        // Making Particles => we will change this as file load such as ajax call
        PARTICLE_SIZE = 5000;

        sprites = [];
        // making geometry
        for(i=0; i < PARTICLE_SIZE; i++){

            // assign vertex position to geometriy
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 8000 - 1000;
            vertex.y = Math.random() * 8000 - 1000;
            vertex.z = Math.random() * 8000 - 1000;

            geometry.vertices.push(vertex);

            // assign other attributes
            // ...


            // text sprite
            var sprite = new text2D.SpriteText2D("Heungseok", {
                align: text2D.textAlign.right,
                font: '15px Arial', fillstyle: "#333", antialias: true
            });
            sprite.name = "Heungseok";
            sprite.position.set(vertex.x, vertex.y, vertex.z);

            // sprites.push(sprite);
            scene.add(sprite);


        }

        parameters = [
            [
                [1, 1, 0.5], 40
            ],
            [
                [0.95, 1, 0.5], 30
            ],
            [
                [0.90, 1, 0.5], 20
            ],
            [
                [0.85, 1, 0.5], 15
            ],
            [
                [0.80, 1, 0.5], 10
            ]
        ];
        parameterCount = parameters.length;

        materials = [];
        for (i=0; i<parameterCount; i++){

            color = parameters[i][0];
            size = parameters[i][1];

            materials.push( new THREE.PointsMaterial({
                size: size,

                blending: THREE.AdditiveBlending,
                depthTest: false,
                depthWrite: false,
                transparent: true,
                sizeAttenuation: true,
                opacity: 0.5

            }));

            particles = new THREE.Points(geometry, materials[i]);
            scene.add(particles);

        }

    }
    
    function initRenderer() {
        renderer = new THREE.WebGLRenderer( { antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);
        container.appendChild(renderer.domElement);

        // Event Listeners
        window.addEventListener('resize', onWindowResize, false);
        // document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener( 'click', onDocumentMouseClick, false)

    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        TWEEN.update();
        render();


    }
    
    function render() {
        var time = Date.now() * 0.00005;

        for (i = 0; i < materials.length; i++) {

            color = parameters[i][0];

            h = (360 * (color[0] + time) % 360) / 360;
            materials[i].color.setHSL(h, color[1], color[2]);
        }

        renderer.render(scene, camera);
    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }



    function onDocumentMouseClick(event) {

        event.preventDefault();

        var geometry = particles.geometry;
        var attributes = geometry;

        targetPosition = {
            x: 0,
            y: 0,
            z: 0
        };

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        intersects = raycaster.intersectObject( particles );
        if ( intersects.length > 0 ) {


            INTERSECTED = intersects[ 0 ].index;
            console.log(attributes.vertices[ INTERSECTED ]);
            // console.log(attributes.indices[ INTERSECTED ]);

            var to = attributes.vertices[ INTERSECTED ]

            targetPosition.x = to.x;
            targetPosition.y = to.y;
            targetPosition.z = to.z;

            cameraToOrigin = true;

            flyToTarget()

            var sphere_geometry = new THREE.SphereGeometry(30, 32, 32);
            var sphere_material = new THREE.MeshNormalMaterial();
            sphere = new THREE.Mesh( sphere_geometry, sphere_material);

            sphere.position.set(to.x,to.y,to.z);
            scene.add(sphere);

        }
    }


    function flyToTarget(){

        var from = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };

        var to = {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z
        };
        console.log("Flying to target" + to);

        var tween = new TWEEN.Tween(from)
            .to(to, 600)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .onComplete(function () {
                cameraAdjust = true;
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                console.log(camera.position);

            })
            .start();

    }


    function intersect(from, to, r) {
        // we are using Cartesian to Spherical coordinates transformation to find
        // theta and phi:
        // https://en.wikipedia.org/wiki/Spherical_coordinate_system#Coordinate_system_conversions
        var dx = from.x - to.x;
        var dy = from.y - to.y;
        var dz = from.z - to.z;
        var r1 = Math.sqrt(dx * dx + dy * dy + dz * dz);
        var teta = Math.acos(dz / r1);
        var phi = Math.atan2(dy, dx);

        // And then based on sphere radius we transform back to Cartesian:
        return {
            x: r * Math.sin(teta) * Math.cos(phi) + to.x,
            y: r * Math.sin(teta) * Math.sin(phi) + to.y,
            z: r * Math.cos(teta) + to.z
        };
    }



}




