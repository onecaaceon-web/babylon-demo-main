import React, { useRef, useState } from 'react';
import { FreeCamera, Scene } from '@babylonjs/core';
import gsap from 'gsap';

type viewItem = {
  pos: { x: number, y: number, z: number },
  rota: { x: number, y: number, z: number },
  time: number
}
//gsap摄像头动画
const AutoView = ({
  scene, cameraName
}: { scene: Scene | undefined, cameraName: string }) => {

  const testList: viewItem[] = [{ "pos": { "x": 110.76614383860021, "y": 93.19550064766116, "z": 364.7990195366278 }, "rota": { "x": 0.7294165289506409, "y": 2.7768426797076566, "z": 0 }, "time": 3 }, { "pos": { "x": 184.05214361366274, "y": 93.1955010634749, "z": 392.75885687850945 }, "rota": { "x": 0.729417, "y": 2.776843, "z": 0 }, "time": 3 }, { "pos": { "x": 184.052144, "y": 93.195501, "z": 392.758857 }, "rota": { "x": 0.508157, "y": 2.77239, "z": 0 }, "time": 5 }, { "pos": { "x": 127.28004971654009, "y": 189.10076598391905, "z": 555.4368520750238 }, "rota": { "x": 0.6050438556969127, "y": 2.8626596699565003, "z": 0 }, "time": 3 }]


  const [viewList, setViewList] = useState<viewItem[]>(testList)
  const [time, setTime] = useState<number>(3)
  const camera = scene?.getCameraByName(cameraName) as FreeCamera

  const t = useRef<any>()
  const setPoint = () => {
    const pos = camera.position.clone();
    const rota = camera.rotation.clone();
    const data = {
      pos: {
        x: pos._x,
        y: pos._y,
        z: pos._z
      },
      rota: {
        x: rota._x,
        y: rota._y,
        z: rota._z
      },
      time: 3
    }
    return data
  }

  /**
   * 根据获取数据自动播放
   * @param viewList 
   */
  const autoGsap = (viewList: viewItem[]) => {
    if (t.current) {
      t.current.kill()
      t.current = null
    }
    if (viewList.length == 1) {
      viewList.forEach(item => {
        gsap.to([camera?.position], { x: item.pos.x, y: item.pos.y, z: item.pos.z, duration: item.time },)
        gsap.to([camera?.rotation], { x: item.rota.x, y: item.rota.y, z: item.rota.z, duration: item.time })
      })
    } else {
      t.current = gsap.timeline()
      const consoleList: any[] = []
      viewList.forEach(item => {
        t.current.to([camera?.position], { x: item.pos.x, y: item.pos.y, z: item.pos.z, duration: item.time },)
        t.current.to([camera?.rotation], { x: item.rota.x, y: item.rota.y, z: item.rota.z, duration: item.time }, "<")

        consoleList.push(`t.to([camera?.position], { x: ${item.pos.x.toFixed(4)}, y: ${item.pos.y.toFixed(4)}, z: ${item.pos.z.toFixed(4)}, duration: ${item.time} },)`)
        consoleList.push(`t.to([camera?.rotation], { x: ${item.rota.x.toFixed(4)}, y: ${item.rota.y.toFixed(4)}, z: ${item.rota.z.toFixed(4)}, duration: ${item.time} },"<")`)
      })
      
      
    }

  }


  const addFun = () => {
    const point = setPoint()
    point!.time = time
    setViewList(pre => [...pre, point])
  }
  const deleteFoo = (index: number) => {
    setViewList(viewList => viewList.filter((_i, _index) => _index !== index))
  }
  const clearFoo = () => {
    setViewList([])
  }

  const viewFoo = (arr: any[]) => {
    autoGsap(arr)
  }

  const viewItem = (index: number) => {
    const arr = viewList.slice(index, index + 1)
    autoGsap(arr)
  }

  const reNew = (index: number) => {
    const item = setPoint()
    item!.time = time
    setViewList(viewList => viewList.map((_i, _index) => {
      if (_index === index) {
        return item
      }
      return _i
    }))
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 10000,
        padding: 15,
        backgroundColor: '#fff',
        opacity: '0.85'
      }}>
        <div style={{
          pointerEvents: "all",
          display: "flex",
          color: "black"
        }}>
          <button style={{
            width: "60px",
            height: "40px",
            backgroundColor: "white",
            textAlign: "center",
            lineHeight: "40px",
            cursor: "pointer"
          }} onClick={addFun}>添加</button>
          <button style={{
            width: "60px",
            height: "40px",
            backgroundColor: "white",
            textAlign: "center",
            lineHeight: "40px",
            marginLeft: "20px",
            cursor: "pointer"
          }} onClick={clearFoo}>清空</button>
          <button style={{
            width: "60px",
            height: "40px",
            backgroundColor: "white",
            textAlign: "center",
            lineHeight: "40px",
            marginLeft: "20px",
            cursor: "pointer"
          }} onClick={() => viewFoo(viewList)}>播放</button>
          <input type="number" placeholder='动画持续时间（s）' style={{ marginLeft: "20px", paddingLeft: 5 }} onChange={(value) => { setTime(Number(value.target.value)) }} />
        </div>
        <div style={{
          height: "400px",
          overflow: "auto",
          marginTop: 15,
          color: '#000'
        }}>
          {
            viewList.length > 0 ? viewList.map((item, index) => (
              <div key={item.pos.x + item.pos.y + item.pos.z + index}>
                <h3>#{index}</h3>
                <div>position:{item?.pos.x.toFixed(4)},{item?.pos.y.toFixed(4)},{item?.pos.z.toFixed(4)}</div>
                <div>rotation:{item?.rota.x.toFixed(4)},{item?.rota.y.toFixed(4)},{item?.rota.z.toFixed(4)}</div>
                <div>dutation:{item?.time}</div>
                <div style={{ marginTop: 5, marginBottom: 5 }}>
                  <button style={{
                    pointerEvents: "all",
                    cursor: "pointer",
                    width: '40px',
                    height: '2 0px',
                    // background: '#000'
                  }} onClick={() => deleteFoo(index)}>删除</button>
                  <button style={{
                    pointerEvents: "all",
                    cursor: "pointer",
                    width: '40px',
                    height: '2 0px',
                    // background: '#000',
                    marginLeft: '10px'
                  }} onClick={() => viewItem(index)}>播放</button>
                  <button style={{
                    pointerEvents: "all",
                    cursor: "pointer",
                    width: '40px',
                    height: '2 0px',
                    // background: '#000',
                    marginLeft: '10px'
                  }} onClick={() => reNew(index)}>更新</button>
                </div>

              </div>
            )) : null
          }
        </div>
      </div>
    </>

  )
}

export default AutoView;