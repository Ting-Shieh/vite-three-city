
import { loadFBX } from '@/utils/index.js'
import { SurroundLine } from '@/effect/surroundLine.js'
import { Background } from '@/effect/background.js'
import { Radar } from '@/effect/radar.js'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

// import * as THREE from 'three'
export class City {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.tweenPosition = null
    this.tweenRotation = null
    // 對象格式 ＝> 為了每一幀都是同一個對象
    this.height = {
      value: 5
    }
    this.time = {
      value: 0
    }
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
    this.addClick()
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
  }
}