import * as THREE from 'three'
// import { Points } from './points.js'

export class Smoke {
  constructor(scene){
    this.scene = scene
    this.smokes = []
    this.init()
    // new Points(scene, {

    // })
  }
  init(){
    // 粒子初始化，空的緩衝幾何體
    this.geometry = new THREE.BufferGeometry()
    // // 空的緩衝幾何體 => 需要自己設置：座標訊息 紋理訊息 自己設置的變量訊息...
    // this.geometry.setAttribute(
    //   'position',
    //   new THREE.BufferAttribute(
    //     new Float32Array(
    //       [1400, 250, 50]
    //     ),
    //     3
    //   )
    // )
    this.material = new THREE.PointsMaterial({
      size: 400,
      map: new THREE.TextureLoader().load('../../src/assets/smoke.png'),
      transparent: true,
      depthWrite: false // 禁止深度寫入
    })
    // 改變 material 的 size
    this.material.onBeforeCompile = function(shader) {
      // material 的 參數列表
      // console.log(shader)
      const vertex1 = `
        attribute float a_opacity;
        attribute float a_size;
        attribute float a_scale;
        varying float v_opacity;

        void main() {
          v_opacity = a_opacity;
      `
      const glPosition =  `
        gl_PointSize = a_size * a_scale;
      `
      shader.vertexShader = shader.vertexShader.replace('void main() {', vertex1)
      shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size ', glPosition)
      const fragment1 = `
        varying float v_opacity;
        void main() {
      `
      const fragment2 = `
        gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
      `
      shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment1)
      shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4(outgoingLight, diffuseColor.a);', fragment2)

    }
    this.points = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.points)
  }
  createParticle(){
    this.smokes.push({
      size: 10,
      opacity: 1,
      x: 1400,
      y: 500,
      z: 50,
      speed: {
        x: Math.random() - 1 / 2,
        y: Math.random() + 0.3,
        z: Math.random(),
      },
      scale: 1
    })
  }
  setAttribute(positionList, opacityList, sizeList, scaleList){
    // 空的緩衝幾何體 => 需要自己設置：座標訊息 紋理訊息 自己設置的變量訊息...
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array(
          positionList
        ),
        3
      )
    )
    this.geometry.setAttribute(
      'a_opacity',
      new THREE.BufferAttribute(
        new Float32Array(
          opacityList
        ),
        1
      )
    )
    this.geometry.setAttribute(
      'a_size',
      new THREE.BufferAttribute(
        new Float32Array(
          sizeList
        ),
        1
      )
    )
    this.geometry.setAttribute(
      'a_scale',
      new THREE.BufferAttribute(
        new Float32Array(
          scaleList
        ),
        1
      )
    )
  }
  /**
   * 更新煙霧座標
   */
  update(){
    const positionList = []
    const opacityList = []
    const sizeList = []
    const scaleList = []
    this.smokes = this.smokes.filter((item) => {
      // 達到某一條件，拋棄當前粒子
      if (item.opacity < 0) {
        return false
      }
      // 改變煙粒透明度
      item.opacity -= 0.001
      // 改變位置
      item.x += item.speed.x
      item.y += item.speed.y
      item.z += item.speed.z
      // 改變擴散速度
      item.scale += 0.01
      positionList.push(item.x, item.y, item.z) // 煙粒位置
      opacityList.push(item.opacity) // 煙粒透明度
      sizeList.push(item.size) // 煙粒大小
      scaleList.push(item.scale) // 煙粒縮放
      return true
    })
    this.setAttribute(positionList, opacityList, sizeList, scaleList)
  }
  animation(){
    this.createParticle()
    this.update()
  }
}