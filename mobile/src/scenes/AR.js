import React, { useEffect } from 'react';
import { AR } from 'expo';
import {View, SafeAreaView, StatusBar, Text, StyleSheet, TouchableOpacity} from 'react-native'
import ExpoTHREE, { THREE } from 'expo-three';
import * as ThreeAR from 'expo-three-ar';
import { View as GraphicsView } from 'expo-graphics';

export default function App({navigation}) {
  let renderer;
  let scene;
  let camera;

  useEffect(() => {
    THREE.suppressExpoWarnings(true);
  }, []);

  function spawnPurpleCube() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshPhongMaterial({
        color: 0x7159c1,
      })
    );
    cube.position.z = 1;

    scene.add(cube);
  }

  async function spawn2dPokemon() {
    const texture = await ExpoTHREE.loadAsync(
      'https://pngimg.com/uploads/pokemon/pokemon_PNG108.png'
    );
    const pikachuImage = new THREE.MeshPhongMaterial({ map: texture });

    const pikachu = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), pikachuImage);
    pikachu.position.z = -0.4;

    scene.add(pikachu);
  }

  async function spawn3dPokemon() {
    const model = {
      'umbreon.obj': require('./logo3D/logo.obj'),
      'umbreon.mtl': require('./logo3D/logo.mtl'),
      'umbreon.png': require('./umbreon/Umbreon.png'),
    };

    const umbreon = await ExpoTHREE.loadAsync(
      [model['umbreon.obj'], model['umbreon.mtl']],
      null,
      name => model[name]
    );

    ExpoTHREE.utils.scaleLongestSideToSize(umbreon, 0.2);
    ExpoTHREE.utils.alignMesh(umbreon, { y: 1 });
  
    scene.add(umbreon);
  }
  async function spawn3dStarTrooper() {
    const model = {
      'umbreon.obj': require('./logo3D/logo.obj'),
      'umbreon.mtl': require('./logo3D/logo.mtl'),
      'umbreon.png': require('./umbreon/Umbreon.png'),
    };

    const umbreon = await ExpoTHREE.loadAsync(
      [model['umbreon.obj'], model['umbreon.mtl']],
      null,
      name => model[name]
    );

    ExpoTHREE.utils.scaleLongestSideToSize(umbreon, 0.2);
    ExpoTHREE.utils.alignMesh(umbreon, { y: 1 });
  
    scene.add(umbreon);
  }

  async function onContextCreate({ gl, scale: pixelRatio, width, height }) {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    /**
     * Setup Scene, Camera and Ambient Light
     */
    scene = new THREE.Scene();
    scene.background = new ThreeAR.BackgroundTexture(renderer);

    camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    scene.add(new THREE.AmbientLight(0xffffff));

    /**
     * Purple Cube
     */
    // spawnPurpleCube();

    /**
     * Pikachu (2D plane)
     */
    // spawn2dPokemon();

    /**
     * Umbreon Pokemon (3D model with texture fail)
     */
    spawn3dStarTrooper()
  }

  function onResize({ x, y, scale, width, height }) {
    if (!renderer) {
      return;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  }

  function onRender() {
    renderer.render(scene, camera);
  }

  return (
    <>
        <StatusBar barStyle='light-content' />
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#111' }}>

            <GraphicsView
            onContextCreate={onContextCreate}
            onRender={onRender}
            onResize={onResize}
            isArEnabled
            isArRunningStateEnabled
            isArCameraStateEnabled
            arTrackingConfiguration={'ARWorldTrackingConfiguration'}
            />
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={item => navigation.navigate('auth')}>
                    <Text style={styles.text}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%'
    },
    back: {
        borderWidth: 1,
        height: '90%',
        width: '80%',
        borderRadius: 10,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#fff'
    }
})