import React, { useCallback, useEffect, useState, useRef} from 'react';
import { useHistory } from 'react-router';
import {Stage ,Graphics } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js'
import { addPaint } from '../models/models';
import { useAuthContext } from '../context/AuthContext';
import Announce from './Announce';

const PixiTest = (props) => {
  const [posX, setPosX] = useState();
  const [posY, setPosY] = useState();
  const [moveX, setMoveX] = useState();
  const [moveY, setMoveY] = useState();
  const [error, setError] = useState("");
  
  const [isWrite, setIsWrite] = useState(false);
  const [titleName, setTitleName] = useState("");
  const [url, setUrl] = useState("")

  const { user, setLogs} = useAuthContext();

  
  const stageRef = useRef(null);
  const grapficsRef = useRef(null);
  const titleRef = useRef(null);
  let history = useHistory();

  const mouseDown = (e) => {
    setIsWrite(true);
    setPosX(e.nativeEvent.offsetX)
    setPosY(e.nativeEvent.offsetY)
  }

  const mouseUp = (e) => {
    setIsWrite(false);
  }

  const mouseMove = (e) => {
    setPosX(e.nativeEvent.offsetX)
    setPosY(e.nativeEvent.offsetY)
    
  }

  const touchStart = (e) => {
    console.log("touchStart");
    console.log(e.touches[0].clientX)
    console.log(grapficsRef)
    console.log(stageRef.current)

    setIsWrite(true);
    console.log(e.touches[0].clientX - stageRef.current._canvas.offsetLeft)
    setPosX(e.touches[0].clientX - stageRef.current._canvas.offsetLeft)
    setPosY(e.touches[0].clientY)
    console.log(e.touches[0].clientY)
    console.log(posX)
    console.log(posY)
    // etBoundingClientRect()

  }
  const touchEnd = (e) => {
    console.log("touchEnd");
    console.log("touchEnd："+e)
    setIsWrite(false);
  }
  const touchMove = (e) =>{
    console.log("touchMove");
    console.log(e.touches)
    setPosX(e.touches[0].clientX - stageRef.current._canvas.offsetLeft)
    setPosY(e.touches[0].clientY)
  }

  const draw = useCallback((g) => {
    if(!isWrite) return;
    console.log("draw");
    g.beginFill(props.color);
    // g.lineStyle({width:4, color:0x000,alpha:1, alignment:0.5, native:false, cap:"PIXI.LINE_CAP.ROUND"});
    g.lineStyle(4, 0x000,1, 0.5, false, "ROUND");

    // g.lineStyle({"options.cap":"round"});
    g.moveTo(posX, posY);
    console.log(moveX,moveY)
    g.lineTo(moveX, moveY);
    setPosX(moveX);
    setPosY(moveY);
  }, [moveX, moveY, props.color, isWrite, posX, posY]);

  const register = () => {
    // console.log(stageRef.current._canvas.toDataURL())  
    // console.log(grapficsRef)
    if(titleRef.current.value === ""){
      setError("タイトルを入力してください")
      return 
    }
    setTitleName(titleRef.current.value)
    setUrl(stageRef.current._canvas.toDataURL())
    addPaint(user.uid,titleRef.current.value, stageRef.current._canvas.toDataURL()).then(
      // setLogs({userLog:user, titleLog:titleRef.current.value, actionLog: '作成'}),
      alert("アップロード完了"),
      history.push('/Mypage')

    )
  }

  return (
    <>
        <p>
          title:
          <input name="title" type="text" ref={titleRef} placeholder="title" required/>
        </p>
        <p>{error}</p>
        <Stage 
          ref={stageRef}
          width={300} 
          height={300} 
          options={{
             backgroundColor: 0xfffffffff ,
             preserveDrawingBuffer: true,
             antialias: true
            }} 
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
          onMouseMove={mouseMove} 
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          renderOnComponentChange={true} //画像URLに変換するための設定
          >
          <Graphics draw={draw} ref={grapficsRef} /> 
        </Stage>
        <p><input type="button" value="登録" onClick={register}/></p>
    </>
  );
}

export default PixiTest;