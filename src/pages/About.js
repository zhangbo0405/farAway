import React, { Component } from 'react';
import config from './config'
const baseImageUrl =
  process.env.NODE_ENV === 'development' ? config.baseImageUrl.dev : config.baseImageUrl.pro


class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      addt: 0
    };
    this.audioRef = React.createRef();
    this.timer = null; // 用于存储定时器的引用
  }

  componentWillUnmount() {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 当组件卸载时，确保释放 audio 元素资源
    if (this.audioRef.current) {
      this.audioRef.current.pause();
      this.audioRef.current.load();
    }
  }

  togglePlay = (t) => {
    console.log('哈哈哈',baseImageUrl,this.state.addt)
    if (this.state.isPlaying) {
      // 如果正在播放，则暂停
      if (this.audioRef.current) {
        this.audioRef.current.pause();
      }
      this.setState({ isPlaying: false });
      // 清除之前的定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
    } else {
      // 如果暂停或停止，则播放
      if (this.audioRef.current) {
        this.audioRef.current.play();
      }
      this.setState({ isPlaying: true });
      // 设置倒计时定时器
      this.timer = setTimeout(() => {
        if (this.audioRef.current) {
          this.audioRef.current.pause();
        }
        this.setState({ isPlaying: false });
      }, t);
    }
  };
  clickmeAdd1s=()=>{
    this.setState({ addt: this.state.addt+300 },()=>{
      this.togglePlay(this.state.addt)
    });
  }

  resetAudio = () => {
    if (this.audioRef.current) {
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0; // 重置到开始
      this.setState({ isPlaying: false });
    }
  };

  render() {
    return (
        <div>
        <audio ref={this.audioRef} src={`${baseImageUrl}DIAN.WAV`} />
        <button onClick={this.togglePlay}>
          {this.state.isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={this.resetAudio}>Reset</button>
        <button onClick={this.clickmeAdd1s}>clickmeAdd1s</button>
        <p style={{color:'white'}}>Addt: {this.state.addt}</p> {/* 显示addt的值 */}
      </div>
    );
  }
}

export default About;


// import React from 'react';

// function About() {
//     return <>
//     <h1>About Pages!</h1>
//     <h3>About:h3</h3>
//     </>
// }

// export default About;