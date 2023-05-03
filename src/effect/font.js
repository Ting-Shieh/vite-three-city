import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import {color} from '../config/constants.js'

export class Font {
  constructor(scene, time){
    this.scene = scene
    this.font = null
    this.init()
  }
  init() {
    const loader = new FontLoader()
    loader.load('/font.json', (font) => {
      this.font = font
      // 創建字體幾何體
      this.createTextQueue()
    })
  }
  createTextQueue(){
    [
      {
        text: '高雄市立美術館',
        size: 20,
        position: {
          x: -2000,
          y: 1800,
          z: -5100
        },
        rotate: Math.PI /20,
        color: '#ffffff'
      },
      {
        text: '第二高',
        size: 20,
        position: {
          x: 180,
          y: 1200,
          z: -70
        },
        rotate: Math.PI / 2,
        color: '#ffffff'
      }
    ].forEach(item => {
      this.createText(item)
    })
  }
  createText(data){
    const geometry = new TextGeometry(data.text,{
      font: this.font,
      size: 120,
      height: 2
    })
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main () {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main () {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(data.position)
    mesh.rotateY(data.rotate)
    this.scene.add(mesh)
  }
}