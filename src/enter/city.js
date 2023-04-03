
import { loadFBX } from '@/utils/index.js'
export class City {
  constructor(scene) {
    this.scene = scene
    this.loadCity()
  }

  loadCity(){
    //加載模型並渲染到畫布
    loadFBX('/src/model/kaoshiung-small.fbx').then(object => {
      this.scene.add(object)
    })
  }
  start(){}
}