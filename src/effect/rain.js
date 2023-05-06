import * as THREE from 'three'
import { Points } from './points.js'

export class Rain {
  constructor(scene){
    this.points = new Points(scene, {
      size: 40, 
      opacity:0.8,
      range: 20000,
      count: 800,
      url: '../../src/assets/rain.png',
      setPosition(position){
        position.speedY = 20
      },
      setAnimation(position){
        position.y -= position.speedY;
        //  邊界檢查
        if (position.y <= 0) {
          position.y = this.range / 2;
        }
      }
    })
    // this.scene = scene
    // // 飄落範圍
    // this.range = 20000
    // // 個數
    // this.count = 600
    // this.pointsList = []
    // this.init()
  }
  // init(){
  //     // 創建粒子
  //     this.material = new THREE.PointsMaterial({
  //       size: 50,
  //       map : new THREE.TextureLoader('../../src/assets/rain.png'),
  //       transparent: true, // 透明度
  //       opacity: 0.4,
  //       depthTest: false // 消除Loader的黑色背景
  //     })
  //     this.geometry = new THREE.BufferGeometry()
  //     for (let i = 0; i < this.count; i++) {
  //       const position = new THREE.Vector3(
  //         Math.random() * this.range - this.range / 2,
  //         Math.random() * this.range,
  //         Math.random() * this.range - this.range / 2
  //       )
  //       position.speedY = 20
  //       this.pointsList.push(position)
  //     }
  //     this.geometry.setFromPoints(this.pointsList)

  //     this.points = new THREE.Points(this.geometry, this.material)

  //     this.scene.add(this.points)
  // }
  animation() {
    // this.pointsList.forEach(position => {
    //   position.y -= position.speedY;
    
    //   //  邊界檢查
    //   if (position.y <= 0) {
    //     position.y = this.range / 2;
    //   }
    // })
    
    // this.points.geometry.setFromPoints(this.pointsList);
    this.points.animation();
  }
}