import * as THREE from 'three'

import {color} from '../config/constants.js'
export class Radar {
  constructor(scene, time) {
    this.scene = scene
    this.time = time
    this.init()
  }
  init(){
    // 定義雷達半徑（效果）範圍
    const radius = 1500
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 1, 1)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        //  雷達顏色
        u_radar_color: {
          value: new THREE.Color(color.radarColor)
        },
        // 變化的值
        u_time: this.time,
        // 半徑
        u_radius: {
          value: radius
        },
      },
      transparent: true,
      side: THREE.DoubleSide,
      // 片源著色器需要使用到 vertex 變量則需要在 vertexShader 中定義 varying變量．
      vertexShader: `
        varying vec2 v_position;
        void main () {
          v_position = vec2(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec2 v_position;

        uniform float u_time;
        uniform vec3 u_radar_color;
        uniform float u_radius;
        
        void main () {
          float angle = atan(v_position.x, v_position.y);
          float new_angle = mod(angle + u_time, 3.1415926 * 2.0);
          // 圓邊框
          // 距離計算
          float dis = distance(vec2(0.0, 0.0), v_position);
          // 外層圓環的寬度
          float borderWidth = 20.0;
          // 透明度
          float f_opacity = 0.0;
          // 當前片源在於圓環上
          if(dis > u_radius - borderWidth){
            f_opacity = 1.0;
          }
          // 雷達掃描的顯示
          if(dis < u_radius - borderWidth){
            f_opacity = 1.0 - new_angle;
          }
          // 當前片源在雷達之外
          if(dis > u_radius){
            f_opacity = 0.0;
          }
          gl_FragColor = vec4(u_radar_color, f_opacity);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateX(-Math.PI / 2)
    mesh.position.set(-300, 0, 100)
    this.scene.add(mesh)
  }
}