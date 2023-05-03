import * as THREE from 'three'
import {color} from '../config/constants.js'

export class Snow {
  constructor(scene) {
    this.scene = scene
    // 雪花飄落範圍
    this.range = 20000
    // 雪花個數
    this.count = 600
    this.init()
  }
  init(){
    // 粒子和粒子系統
    // 材質
    this.material = new THREE.PointsMaterial({
      size: 150,
      map: new THREE.TextureLoader().load('../../src/assets/snow.png'),
      transparent: true, // 透明度
      opacity: 0.8,
      depthTest: false // 消除Loader的黑色背景
    })
    
    // 幾何對象
    this.geometry = new THREE.BufferGeometry()
    const points = []
    // 添加頂點訊息
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2, // 有負數
        Math.random() * this.range + 100,
        Math.random() * this.range - this.range / 2
      )
      points.push(position)
    }
    // 添加到幾何對象上（粒子對象有座標訊息）
    this.geometry.setFromPoints(points)
    // 實現粒子系統
    const pointsSystem = new THREE.Points(this.geometry, this.material)
    this.scene.add(pointsSystem)
  }
}