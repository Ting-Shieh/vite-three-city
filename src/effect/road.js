import * as THREE from 'three'
import {color} from '../config/constants.js'

export class Road {
  constructor(scene, time, top, height) {
    this.scene = scene
    this.time = time

    this.createRoad({
      // 飛線長度
      range: 1800,
      // 飛線高度
      height: 1600,
      // 飛線大小
      size: 30,
      widthSize: 6.0, // 射線寬比
      len: 400,
      color: color.flyColor
    })
  }
  createRoad (options){
    // 添加貝賽爾曲線運動
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1400, 0, -3900),
      new THREE.Vector3(-5600, 0, -3900),
      new THREE.Vector3(-5600, 0, 1000),
      // new THREE.Vector3(40, 0, 40),
      // new THREE.Vector3(30, 0, 150),
      // new THREE.Vector3(-100, 0, 310),
    ])
    // 從起始點到終止點能獲取多少粒子
    const points = curve.getPoints(400)
    // 
    const positions = []
    const aPositions = []
    points.forEach((item, index) => {
      positions.push(
        item.x,
        item.y,
        item.z
      )
      aPositions.push(index)
    })
    //
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)  
    )
    geometry.setAttribute(
      'a_position',
      new THREE.Float32BufferAttribute(aPositions, 1)  
    )
    const material = new THREE.ShaderMaterial({
      uniforms: {
        // 顏色
        u_color: {
          value: new THREE.Color(options.color)
        },
        //
        u_range: {
          value: options.range
        },
        //
        u_size: {
          value: options.size
        },
        // 執行飛線所需要的是粒子數量
        u_total: {
          value: options.len
        },
        u_width_size: {
          value: options.widthSize
        },
        u_time: this.time,
      },
      transparent: true, // 是否顯示白線
      // side: THREE.DoubleSide,// 解決只顯示一半的問題
      depthTest: false, // 被建築物遮擋的問題
      vertexShader: `
        attribute float a_position;
        uniform float u_range;
        uniform float u_size;
        uniform float u_total;
        uniform float u_time;
        uniform float u_width_size;

        varying float v_opacity;

        void main () {
          float size = u_size;
          float total_number = u_total * mod(u_time, 1.0);
          if (total_number > a_position && total_number < a_position + u_range) {
            // 拖尾效果
            float index = (a_position + u_range - total_number) / u_range;
            size *= index;
            v_opacity = 1.0;
          } else {
            v_opacity = 0.0;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size / u_width_size;
        }  
      `,
      fragmentShader: `
        uniform vec3 u_color;
        varying float v_opacity;
        void main () {
          // 當前路徑上可以繪製多少粒子
          gl_FragColor = vec4(u_color, v_opacity);
        }  
      `,
    })

    const point = new THREE.Points(geometry, material)
    
    this.scene.add(point)
  }
  
}