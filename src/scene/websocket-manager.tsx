import React from 'react';
import { Scene} from '@babylonjs/core';

//websocket通讯
interface Props {
  scene: Scene;
  socketUrl: string;
  onReceiveInfo: (info: any) => void;
}
interface States {
  isConnected: boolean;
}
class WebSocketManager extends React.PureComponent<Props, States> {
  public socketURL: string;
  public ws: any;
  public scene: Scene;
  private _heartbeatInterval: number;
  private maxMissedHeartbeats: number;
  private missedHeartbeats: number;
  private _heartbeatTimer: any;
  // private _reConnectTimer: any;
  private _heartbeatTimeout: any;
  // private _isAuthorized: Boolean;
  // private _reConnectAttempts: number;
  constructor(props: Props) {
    super(props);
    this.scene = props.scene;
    this.socketURL = props.socketUrl;
    this._heartbeatInterval = 1000 * 3; // 心跳间隔时间
    this.maxMissedHeartbeats = 5; // 连续未收到心跳的最大次数
    this.missedHeartbeats = 0;
    this._heartbeatTimer = null;
    // this._reConnectAttempts = 0;
    // this._reConnectTimer = null;
    this._heartbeatTimeout = null; //检测心跳超时
    // this._isAuthorized = false;
    this.ws = null;
    this.state = {
      isConnected: false
    };
  }

  public connect = () => {
    this.disconnect();
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(this.socketURL);
      this.ws.onopen = this.onOpen;
      this.ws.onmessage = this.onMessage;
      this.ws.onclose = this.onClose;
      this.ws.onerror = this.onError;
    } else {
      
    }
  };

  private onOpen = () => {
    
    this.setState({ isConnected: true });
    // this.sendAuthorized();
  };

  private onMessage = (event: any) => {
    
    let { data, type } = JSON.parse(event.data);
    if (type === 'AUTHORIZED') {
        
      // if (Number(code) === 200) {
      //   console.warn('授权成功');
      //   this._isAuthorized = true;
      //   this.startHeartbeat();
      // }
    } else
      //心跳回应消息
      if (type === 'HEARTBEAT') {
        
        // this.missedHeartbeats = 0; // 重置错过的心跳次数
        // this._heartbeatTimeout && clearTimeout(this._heartbeatTimeout); // 清除心跳超时定时器
      } else if (type === 'REQUEST') {
        // 其他业务逻辑处理
        if (data) {
          // console.warn('业务数据: ', data);
          //告知服务端收到消息
          // this.sendMsg('', 'RESPONSE');
        }
      }
  };

  private onClose = () => {
    
    this.setState({ isConnected: false });
    // this.stopHeartbeat();
    // // 尝试重连
    // if (this._reConnectAttempts > 6) {
    //   // this._reConnectTimer && clearInterval(this._reConnectTimer);
    //   // console.warn(`达到${this._reConnectAttempts}次最大重连次数，不再尝试重连`);
    //   return
    // }
    // this.connect();
    // ++this._reConnectAttempts
    // console.warn(`已尝试${this._reConnectAttempts}次重连`);
    // // this._reConnectTimer && clearInterval(this._reConnectTimer);
  };

  private onError = (error: any) => {
    
    this.setState({ isConnected: false });
    // this.stopHeartbeat();
    // // 尝试重连
    // if (this._reConnectAttempts > 6) {
    //   // this._reConnectTimer && clearInterval(this._reConnectTimer);
    //   // console.warn(`达到${this._reConnectAttempts}次最大重连次数，不再尝试重连`);
    //   return
    // }
    // this.connect();
    // ++this._reConnectAttempts
    // console.warn(`已尝试${this._reConnectAttempts}次重连`);
    // // this._reConnectTimer = setInterval(() => {
    // // }, 1000 * 10);
  };

  private startHeartbeat = () => {
    this.sendHeartbeat();
    this._heartbeatTimer = setInterval(this.sendHeartbeat, this._heartbeatInterval);
  };

  private sendHeartbeat = () => {
    this.sendMsg('ping', 'HEARTBEAT');
    this._heartbeatTimeout = setTimeout(() => {
      // 如果在指定的时间内没有收到心跳回应,错过心跳次数加一
      this.missedHeartbeats++;
      if (this.missedHeartbeats >= this.maxMissedHeartbeats) {
        
        this.connect();
        this.missedHeartbeats = 0;
      }
    }, this._heartbeatInterval);
  };

  private sendAuthorized = () => {
    // 发送授权信息
    const data = {
      auth: {
        username: 'superadmin',
        password: 'S16fy4tiuuno11fMLF1gKg==',
        grant_type: 'password'
      }
    };
    this.sendMsg(data, 'AUTHORIZED')
  };
  private sendMsg(data: any, msgType: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        data: data,
        type: msgType
      }));
    }
  }

  private resetHeartbeat = () => {
    this._heartbeatTimer && clearInterval(this._heartbeatTimer);
    this.startHeartbeat(); // 重新启动心跳定时器
  };

  private stopHeartbeat = () => {
    this._heartbeatTimer && clearInterval(this._heartbeatTimer);
  };

  public disconnect = () => {
    if (this.ws) {
      this.ws.close();
    }
  };

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  render(): React.ReactNode {
    return (
      <>
      </>
    );
  }
}

export default WebSocketManager;