//=============================================================================
//                   Andrea Coppetta - Matricola: 873849
//           Sistema Solare v2.0 - Assignment 1 - WebGL e Three.js
//         Corso: [CT0178] LINGUAGGI PER LA RETE (CT3) - a.a. 2020-21
//=============================================================================
//                              *** CHANGELOG ***
//=============================================================================
// (v2.0) - Rimossi oggetti posizionati al centro per le orbite
//        - Create le orbite tramite matrici
//        - Riordinato il codice
//
// (v1.0) - Creato il sistema solare (con rotazioni casuali)
//=============================================================================


window.onload = function(){

    // Costanti ---------------------------------------------------------------
    // Posizioni
    var mercuryTras = new THREE.Matrix4().makeTranslation(25, 0, 0);
    var venusTras = new THREE.Matrix4().makeTranslation(35, 0, 0);
    var earthTras = new THREE.Matrix4().makeTranslation(-48, 0, 0);
    var moonTras = new THREE.Matrix4().makeTranslation(5, 2, 0);
    var marsTras = new THREE.Matrix4().makeTranslation(-60, 20, -30);
    var jupiterTras = new THREE.Matrix4().makeTranslation(-80, 15, 50);
    var jupiterMoon1Tras = new THREE.Matrix4().makeTranslation(10, 2, 4);
    var jupiterMoon2Tras = new THREE.Matrix4().makeTranslation(-7, 6, 3);
    var jupiterMoon3Tras = new THREE.Matrix4().makeTranslation(5, 8, 0);
    var saturnTras = new THREE.Matrix4().makeTranslation(108, 25, 100)
    var saturnDis = new THREE.Matrix4().makeRotationZ(0.5);
    var uranusTras = new THREE.Matrix4().makeTranslation(135, -20, 200);
    var neptuneTras = new THREE.Matrix4().makeTranslation(155, 15, -150);


    // Scena * ----------------------------------------------------------------
    var scene = new THREE.Scene();

    
    // Camera * ---------------------------------------------------------------
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 100;  // up
    camera.position.z = 200;  // zoom out
    camera.rotation.x = -0.5; // rotate down


    // WebGl Renderer * -------------------------------------------------------
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // Mesh o oggetti ---------------------------------------------------------
    // Sfondo
    var backgroundTesture = THREE.ImageUtils.loadTexture('img/background.jpg');
    scene.background = backgroundTesture;

    
    // Oggetti: pianeti e lune texturizzate (sfere)
    var sun = MeshGenerator(15, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Sun.jpg')});
    var mercury = MeshGenerator(2, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Mercury.jpg')});
    var venus = MeshGenerator(2.5, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Venus.jpg')});
    var earth = MeshGenerator(3, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Earth.jpg')});
    var moon = MeshGenerator(1, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Moon.jpg')});
    var mars = MeshGenerator(2, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Mars.jpg')});
    var jupiter = MeshGenerator(8, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Jupiter.jpg')});
    var jupiterMoon1 = MeshGenerator(1, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Saturn.jpg')});
    var jupiterMoon2 = MeshGenerator(1, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Uranus.jpg')});
    var jupiterMoon3 = MeshGenerator(1, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Neptune.jpg')});
    var saturn = MeshGenerator(8, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Saturn.jpg')});
    var uranus = MeshGenerator(6, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Uranus.jpg')});
    var neptune = MeshGenerator(6, 32, 32, {map: THREE.ImageUtils.loadTexture('img/Neptune.jpg')});

    // Oggetto: asteroidi di saturno (cerchio)
    var asteroidsTexture = new THREE.ImageUtils.loadTexture('img/SaturnAsteroids.png');
    var saturnAsteroids = new THREE.Mesh(new THREE.CircleGeometry(16, 32), new THREE.MeshBasicMaterial( {map: asteroidsTexture, transparent: true} ));
    saturnAsteroids.rotation.x = Math.PI / 2 + Math.PI;
    saturnAsteroids.material.side = THREE.DoubleSide;
    
    // Aggiunta pianeti alla scena
    scene.add(sun);
    
    sun.add(mercury);
    sun.add(venus);
    sun.add(earth);
    earth.add(moon);
    sun.add(mars);
    sun.add(jupiter);
    jupiter.add(jupiterMoon1);
    jupiter.add(jupiterMoon2);
    jupiter.add(jupiterMoon3);
    sun.add(saturn);
    saturn.add(saturnAsteroids);
    sun.add(uranus);
    sun.add(neptune);

    // Funzione per generare mesh piu' velocemente
    function MeshGenerator(sphereRadius, sphereWidthSegments, sphereHeightSegments, texture){
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments), new THREE.MeshLambertMaterial( texture ));
        mesh.matrixAutoUpdate = false;
        return mesh;
    }


    // Light ------------------------------------------------------------------
    // Luce del sole
    var pointLight = new THREE.PointLight( 0xffffff, 1, Infinity );
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Luce che illumina il sole
    const spotLight = new THREE.SpotLight( 0xffffff, 2, 250 );
    spotLight.castShadow = true;
    spotLight.position.set( 0, 50, 100);
    scene.add(spotLight);


    // Animazione -------------------------------------------------------------
    
    var render_scene = function(){
        // Non utilizzata
        var now = Date.now();
        var dt = now - (render_scene.time || now);
        render_scene.time = now;
        var rot = new THREE.Matrix4().makeRotationY(0.0005);
        //box.matrix.multiply(rot);
        
        // Velocita' di rotazione dei pianeti su se stessi
        var sunRot = new THREE.Matrix4().makeRotationY(0.010);
        var mercuryRot = new THREE.Matrix4().makeRotationY(0.0005*render_scene.time);
        var venusRot = new THREE.Matrix4().makeRotationY(0.0003*render_scene.time);
        var earthRot = new THREE.Matrix4().makeRotationY(0.0006*render_scene.time);
        var moonRot = new THREE.Matrix4().makeRotationY(0.0004*render_scene.time);
        var marsRot = new THREE.Matrix4().makeRotationY(0.0005*render_scene.time);
        var jupiterRot = new THREE.Matrix4().makeRotationY(0.0006*render_scene.time);
        var jupiterMoon1Rot = new THREE.Matrix4().makeRotationY(0.0006*render_scene.time);
        var jupiterMoon2Rot = new THREE.Matrix4().makeRotationY(0.0020*render_scene.time);
        var jupiterMoon3Rot = new THREE.Matrix4().makeRotationY(0.0010*render_scene.time);
        var saturnRot = new THREE.Matrix4().makeRotationY(0.0007*render_scene.time);
        var uranusRot = new THREE.Matrix4().makeRotationY(0.0008*render_scene.time);
        var neptuneRot = new THREE.Matrix4().makeRotationY(0.0005*render_scene.time);

        // Velocita' di rotazione delle orbite attorno al sole
        var mercuryOrbit = new THREE.Matrix4().makeRotationY(0.0005*render_scene.time);
        var venusOrbit = new THREE.Matrix4().makeRotationY(0.0003*render_scene.time);
        var earthOrbit = new THREE.Matrix4().makeRotationY(0.0006*render_scene.time);
        var moonOrbit = new THREE.Matrix4().makeRotationY(0.0004*render_scene.time);
        var marsOrbit = new THREE.Matrix4().makeRotationY(0.0005*render_scene.time);
        var jupiterOrbit = new THREE.Matrix4().makeRotationY(0.0006*render_scene.time);
        var jupiterMoon1Orbit = new THREE.Matrix4().makeRotationY(0.0006*render_scene.time);
        var jupiterMoon2Orbit = new THREE.Matrix4().makeRotationY(0.0020*render_scene.time);
        var jupiterMoon3Orbit = new THREE.Matrix4().makeRotationY(0.0010*render_scene.time);
        var saturnOrbit = new THREE.Matrix4().makeRotationY(0.0007*render_scene.time);
        var uranusOrbit = new THREE.Matrix4().makeRotationY(0.0008*render_scene.time);
        var neptuneOrbit = new THREE.Matrix4().makeRotationY(0.0005*render_scene.time);

        // Animazione rotazione dei pianeti e delle loro lune
        sun.matrix.multiply(sunRot);
        mercury.matrix = mercuryOrbit.multiply(mercuryTras).multiply(mercuryRot);
        venus.matrix = venusOrbit.multiply(venusTras).multiply(venusRot);
        earth.matrix = earthOrbit.multiply(earthTras).multiply(earthRot);
        moon.matrix = moonOrbit.multiply(moonTras).multiply(moonRot);
        mars.matrix = marsOrbit.multiply(marsTras).multiply(marsRot);
        jupiter.matrix = jupiterOrbit.multiply(jupiterTras).multiply(jupiterRot);
        jupiterMoon1.matrix = jupiterMoon1Orbit.multiply(jupiterMoon1Tras).multiply(jupiterMoon1Rot);
        jupiterMoon2.matrix = jupiterMoon2Orbit.multiply(jupiterMoon2Tras).multiply(jupiterMoon2Rot);
        jupiterMoon3.matrix = jupiterMoon3Orbit.multiply(jupiterMoon3Tras).multiply(jupiterMoon3Rot);
        saturn.matrix = saturnOrbit.multiply(saturnTras).multiply(saturnRot).multiply(saturnDis);
        saturnAsteroids.matrix = saturnRot;
        uranus.matrix = uranusOrbit.multiply(uranusTras).multiply(uranusRot);
        neptune.matrix = neptuneOrbit.multiply(neptuneTras).multiply(neptuneRot);
        
        renderer.render(scene, camera);
        requestAnimationFrame(render_scene);
        console.log("Rendering");
    }

    render_scene();

}