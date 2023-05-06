import * as THREE from 'three'

export class Points{
  constructor(scene, { size, opacity, range, count, url, setPosition, setAnimation }) {
    this.scene = scene
    // 飄落範圍
    this.range = range
    // 個數
    this.count = count
    this.pointList = []
    this.size = size
    this.opacity = opacity
    this.url = url
    this.setPosition = setPosition
    this.setAnimation = setAnimation
    this.init()
  }
  init(){
    // 粒子和粒子系統
    // 材質
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true, // 透明度
      opacity: this.opacity,
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
      this.setPosition(position)
      // position.speedX = Math.random() - 0.5
      // position.speedY = Math.random() + 40
      // position.speedZ = Math.random() - 0.5

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
      // 動畫效果
      this.setAnimation(position)
      // position.x -= position.speedX // X軸動畫效果
      // position.y -= position.speedY // Y軸動畫效果
      // position.z -= position.speedZ // Z軸動畫效果
      // // 邊界檢查
      // if (position.y <= 0) {
      //   // 回到起始位置
      //   position.y = this.range / 2
      // } 
    })
    // 添加到幾何對象上（粒子對象有座標訊息）
    this.pointsSystem.geometry.setFromPoints(this.pointList)
  }
}