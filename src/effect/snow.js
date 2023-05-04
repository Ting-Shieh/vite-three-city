import * as THREE from 'three'
import {color} from '../config/constants.js'

export class Snow {
  constructor(scene) {
    this.scene = scene
    // 雪花飄落範圍
    this.range = 20000
    // 雪花個數
    this.count = 600
    // 紀錄每一次的座標訊息
    this.pointList = []
    // 粒子系統
    this.pointsSystem = null
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

    // 添加頂點訊息
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2, // 有負數
        Math.random() * this.range + 100,
        Math.random() * this.range - this.range / 2
      )
      // 按照每個粒子指定移動
      position.speedX = Math.random() - 0.5
      position.speedY = Math.random() + 40
      position.speedZ = Math.random() - 0.5

      this.pointList.push(position)
    }
    // 添加到幾何對象上（粒子對象有座標訊息）
    this.geometry.setFromPoints(this.pointList)
    // 實現粒子系統
    this.pointsSystem = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.pointsSystem)
  }

  animation(){
    // // 以下方式效能差
    // this.scene.remove(this.pointsSystem)
    // this.pointList.forEach(position => {
    //   position.x -= position.speedX // X軸動畫效果
    //   position.y -= position.speedY // Y軸動畫效果
    //   position.z -= position.speedZ // Z軸動畫效果

    //   // 添加到幾何對象上（粒子對象有座標訊息）
    //   this.geometry.setFromPoints(this.pointList)
    //   // 實現粒子系統
    //   this.pointsSystem = new THREE.Points(this.geometry, this.material)
    //   this.scene.add(this.pointsSystem)
    // })
    this.pointList.forEach(position => {
      position.x -= position.speedX // X軸動畫效果
      position.y -= position.speedY // Y軸動畫效果
      position.z -= position.speedZ // Z軸動畫效果
      // 邊界檢查
      if (position.y <= 0) {
        // 回到起始位置
        position.y = this.range / 2
      } 
      // 添加到幾何對象上（粒子對象有座標訊息）
      this.pointsSystem.geometry.setFromPoints(this.pointList)
    })
  }
}