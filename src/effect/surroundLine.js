import * as THREE from 'three'

export class SurroundLine {
  constructor(scene, child) {
    this.scene = scene
    this.child = child
    this.render()
  }

  render() {
    const material = new THREE.ShaderMaterial({ 
      uniforms: {
        city_color: {
          value: new THREE.Color('#1B3045')
        }
      },
      vertexShader: `
        void main () {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 city_color;
        void main () {
          gl_FragColor = vec4(city_color, 1.0); // vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
     })

    const mesh =  new THREE.Mesh(this.child.geometry, material)
    // 讓 mesh 繼承 child 的旋轉 縮放 平移
    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)

    this.scene.add(mesh)
  }
}