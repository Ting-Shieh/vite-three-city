import * as THREE from 'three'
import {color} from '../config/constants.js'

export class Cone {
  constructor(scene, time, top, height) {
    this.scene = scene
    this.time = time
    this.top = top
    this.height = height
    this.config = {
      height: 300, // 要比半徑大
      color: color.coneColor,
      opacity: 0.6,
      speed: 4.0,
      position: {
        x: 0,
        y: 800,
        z: 0
      }
    }
    this.createCone(this.config)
  }

  createCone(options){
    const geometry = new THREE.ConeGeometry(
      300,
      600,
      4
    )
    const material = new THREE.ShaderMaterial({
      uniforms: {
        // 顏色
        u_color: {
          value: new THREE.Color(options.color)
        },
        // // 透明度
        // u_opacity: {
        //   value: options.opacity
        // },
        // 高度
        u_top: this.top || 16,
        // 高度
        u_height: this.height,
      },
      transparent: true,
      side: THREE.DoubleSide,// 解決只顯示一半的問題
      depthTest: false, // 被建築物遮擋的問題
      vertexShader: `
        uniform float u_top;
        uniform float u_height;
        void main () {
          float f_angle = u_height / 10.0;
          float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
          float new_y = position.y;
          float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);
          vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * v_position;
        }  
      `,
      fragmentShader: `
        uniform vec3 u_color;
        void main () {
          gl_FragColor = vec4(u_color, 0.6);
        }  
      `,
    })
    const mesh = new THREE.Mesh(geometry, material)
    // mesh.rotateX(-Math.PI / 2)
    // mesh.position.set(0, 0, 0)
    mesh.position.copy(options.position)
    mesh.rotateZ(Math.PI) // 椎體上下翻轉
    this.scene.add(mesh)
  }
}