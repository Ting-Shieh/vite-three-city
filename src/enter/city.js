
import { loadFBX } from '@/utils/index.js'
import { SurroundLine } from '@/effect/surroundLine.js'
import { Background } from '@/effect/background.js'
import { Radar } from '@/effect/radar.js'
import { Wall } from '@/effect/wall.js'
import { Circle } from '@/effect/circle.js'
import { Ball } from '@/effect/ball.js'
import { Cone } from '@/effect/cone.js'
import { Fly } from '@/effect/fly.js'
import { Road } from '@/effect/road.js'
import { Font } from '@/effect/font.js'
import { Snow } from '@/effect/snow.js'
import { Rain } from '@/effect/rain.js'
import { Smoke } from '@/effect/smoke.js'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

// import * as THREE from 'three'
export class City {
  constructor(scene, camera, controls) {
    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.tweenPosition = null
    this.tweenRotation = null
    this.top = {
      value: 0
    }
    this.flag = false // 椎體上下反覆
    // 對象格式 ＝> 為了每一幀都是同一個對象
    this.height = {
      value: 5
    }
    this.time = {
      value: 0
    }
    this.effect = {}
    this.loadCity()
  }

  loadCity(){
    //加載模型並渲染到畫布 // beijing kaoshiung-small
    loadFBX('/src/model/kaoshiung-xs.fbx').then(object => {
      object.traverse((child) => {
        if(child.isMesh){
          // console.log(child)
          // const material = new THREE.MeshLambertMaterial({ color:'#ff0000' })
          // const material = new THREE.ShaderMaterial({ 
          //   uniforms: {
          //     city_color: {
          //       value: new THREE.Color('#1B3045')
          //     }
          //   },
          //   vertexShader: `
          //     void main () {
          //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          //     }
          //   `,
          //   fragmentShader: `
          //     uniform vec3 city_color;
          //     void main () {
          //       gl_FragColor = vec4(city_color, 1.0); // vec4(1.0, 0.0, 0.0, 1.0);
          //     }
          //   `,
          //  })

          // const mesh =  new THREE.Mesh(child.geometry, material)
          // // 讓 mesh 繼承 child 的旋轉 縮放 平移
          // mesh.position.copy(child.position)
          // mesh.rotation.copy(child.rotation)
          // mesh.scale.copy(child.scale)
          
          // this.scene.add(mesh)

          new SurroundLine(this.scene, child, this.height, this.time)
          
        }
      })
      // console.log(object)
      // this.scene.add(object)
      // 模型加載完成後
      this.initEffect()
    })
  }

  initEffect(){
    new Background(this.scene)
    new Radar(this.scene, this.time)
    new Wall(this.scene, this.time)
    new Circle(this.scene, this.time)
    new Ball(this.scene, this.time)
    new Cone(this.scene, this.time, this.top, this.height)
    new Fly(this.scene, this.time)
    new Road(this.scene, this.time)
    new Font(this.scene)
    this.effect.smoke = new Smoke(this.scene)
    // this.effect.snow = new Snow(this.scene)
    // this.effect.rain = new Rain(this.scene)
    this.addClick()
    this.addWheel()
  }
  // 為了讓相機控件與點擊事件作區分
  addClick(){
    let flag = true
    document.onmousedown = (event) => {
      flag = true
      document.onmousemove = () => {
        flag = false
      }
    }

    document.onmouseup = (event) => {
      if(flag){
        this.clickEvent(event)
      }
      document.onmousemove = null
    }
  }
  // 監聽滑鼠縮放
  addWheel(){
    const body = document.body
    body.onmousewheel = (event) => {
      const value = 30
      // 獲取滑鼠當前瀏座標
      const x = (event.clientX / window.innerWidth) * 2 - 1 
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      // 獲取設備座標（三維)
      const vector = new THREE.Vector3(x, y, 0.5)
      // 收到縮放的座標訊息
      vector.unproject(this.camera)
      vector.sub(this.camera.position).normalize()
      if(event.wheelDelta > 0){
        this.camera.position.x += vector.x * value
        this.camera.position.y += vector.y * value
        this.camera.position.z += vector.z * value

        this.controls.target.x += vector.x * value
        this.controls.target.y += vector.y * value
        this.controls.target.z += vector.z * value
      } else {
        this.camera.position.x -= vector.x * value
        this.camera.position.y -= vector.y * value
        this.camera.position.z -= vector.z * value

        this.controls.target.x -= vector.x * value
        this.controls.target.y -= vector.y * value
        this.controls.target.z -= vector.z * value
      }
    }
  }

  clickEvent(event){
    // 獲取瀏覽器座標
    const x = (event.clientX / window.innerWidth) * 2 - 1 
    const y = -(event.clientY / window.innerHeight) * 2 + 1
      
    // 獲取設備座標（三維)
    const standardVector = new THREE.Vector3(x, y, 0.5)
      
    // 轉化爲世界座標
    const worldVector = standardVector.unproject(this.camera)
      
    // 序列化
    const ray = worldVector.sub(this.camera.position).normalize()
      
    // 實現點擊選中 ＝> 創建一射線發射器，用以發射一射線
    const raycaster = new THREE.Raycaster(this.camera.position, ray)
    // 返回射線碰撞到的物體
    const intersects = raycaster.intersectObjects(this.scene.children, true)
    
    let point3d = null
    if (intersects.length) {
      point3d = intersects[0]
    }
    if (point3d) {
      console.log(point3d.object.name)
      // 開始動畫修改觀察點
      const proportion = 3 // 避免靠太近
      const time = 1300 // 動畫執行時間

      this.tweenPosition = new TWEEN.Tween(this.camera.position).to({
        x: point3d.point.x * proportion,
        y: point3d.point.y * proportion,
        z: point3d.point.z * proportion
      }, time).start()
      this.tweenRotation = new TWEEN.Tween(this.camera.rotation).to({
        x: this.camera.rotation.x,
        y: this.camera.rotation.y,
        z: this.camera.rotation.z
      }, time).start()
    }
  }
  start(delta){
    // 雪花動畫
    for (const key in this.effect) {
      this.effect[key] && this.effect[key].animation()
    }
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update()
      this.tweenRotation.update()
    }
    // 
    this.time.value += delta
    // 更新建築物掃描高度
    this.height.value += 0.4
    if(this.height.value > 160){
      this.height.value = 5
    }
    if(this.top.value > 15 || this.top.value < 0){
      this.flag = !this.flag
    }
    this.top.value += this.flag ? -0.8 : 0.8
  }
}