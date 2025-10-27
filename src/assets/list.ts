import { Vector3 } from "@babylonjs/core"

interface iconItem {
  name: string,
  width: number,
  height: number,
  parent: string,
  position?: Vector3,
}

const iconList:iconItem[] = [
  {
    name:'czcfq',
    width:100,
    height:60,
    parent:'HB_ColorBox_01',
  },
]

export { iconList }