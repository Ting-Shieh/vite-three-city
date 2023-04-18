import * as THREE from 'three'
import {color} from '../config/constants.js'
import { Cylinder } from './cylinder.js'
export class Wall {
  constructor(scene, time) {
    // this.scene = scene
    // this.time = time
    // this.color = color.wallColor
    this.config = {
      radius: 1300,
      height: 800,
      open: true,
      color: color.wallColor,
      opacity: 0.6,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      speed: 1.0
    }
      
    // this.createWall()
    new Cylinder(scene, time).createCylinder(this.config)
  }
  createWall(){
  }
  // createWall(){
  //   const geometry = new THREE.CylinderGeometry(
  //     this.config.radius,
  //     this.config.radius,
  //     this.config.height,
  //     32,
  //     1,
  //     this.config.open
  //   )
  //   geometry.translate(0, this.config.height / 2, 0) // 解決光強有一半在睡平面下
  //   const material = new THREE.ShaderMaterial({
  //     uniforms: {
  //       // 光牆顏色
  //       u_wall_color: {
  //         value: new THREE.Color(this.config.color)
  //       },
  //       // 變化的值
  //       u_time: this.time,
  //       // 透明度
  //       u_opacity: {
  //         value: this.config.opacity
  //       },
  //       // 高度
  //       u_height: {
  //         value: this.config.height
  //       },
  //     },
  //     transparent: true,
  //     side: THREE.DoubleSide,// 解決只顯示一半的問題
  //     depthTest: false, // 被建築物遮擋的問題
  //     vertexShader: `
  //       uniform float u_time;
  //       uniform float u_height;

  //       varying float v_opacity;
  //       void main () {
  //         vec3 v_position = position * mod(u_time, 1.0);
  //         // v_opacity = position.y / u_height;
  //         v_opacity = mix(1.0, 0.0, position.y / u_height);
  //         gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
  //       }  
  //     `,
  //     fragmentShader: `
  //       uniform vec3 u_wall_color;
  //       uniform float u_opacity;

  //       varying float v_opacity;
  //       void main () {
  //         gl_FragColor = vec4(u_wall_color, u_opacity * v_opacity);
  //       }  
  //     `,
  //   })
  //   const mesh = new THREE.Mesh(geometry, material)
  //   // mesh.rotateX(-Math.PI / 2)
  //   // mesh.position.set(0, 0, 0)
  //   mesh.position.set(this.config.position)
  //   this.scene.add(mesh)
  // }
}