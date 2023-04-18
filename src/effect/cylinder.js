import * as THREE from 'three'
import {color} from '../config/constants.js'

export class Cylinder {
  constructor(scene, time) {
    this.scene = scene
    this.time = time
  }

  createCylinder(options){
    const geometry = new THREE.CylinderGeometry(
      options.radius,
      options.radius,
      options.height,
      32,
      1,
      options.open
    )
    geometry.translate(0, options.height / 2, 0) // 解決光強有一半在睡平面下
    const material = new THREE.ShaderMaterial({
      uniforms: {
        // 光牆顏色
        u_wall_color: {
          value: new THREE.Color(options.color)
        },
        // 變化的值
        u_time: this.time,
        // 透明度
        u_opacity: {
          value: options.opacity
        },
        // 速度
        u_speed: {
          value: options.speed
        },
        // 高度
        u_height: {
          value: options.height
        },
      },
      transparent: true,
      side: THREE.DoubleSide,// 解決只顯示一半的問題
      depthTest: false, // 被建築物遮擋的問題
      vertexShader: `
        uniform float u_time;
        uniform float u_height;
        uniform float u_speed;

        varying float v_opacity;
        void main () {
          vec3 v_position = position * mod(u_time / u_speed, 1.0);
          // v_opacity = position.y / u_height;
          v_opacity = mix(1.0, 0.0, position.y / u_height);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
        }  
      `,
      fragmentShader: `
        uniform vec3 u_wall_color;
        uniform float u_opacity;

        varying float v_opacity;
        void main () {
          gl_FragColor = vec4(u_wall_color, u_opacity * v_opacity);
        }  
      `,
    })
    const mesh = new THREE.Mesh(geometry, material)
    // mesh.rotateX(-Math.PI / 2)
    // mesh.position.set(0, 0, 0)
    mesh.position.copy(options.position)
    this.scene.add(mesh)
  }
}