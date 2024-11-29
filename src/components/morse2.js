import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd'
import config from "./config";

import TimeComponent from './TimeComponent'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseImageUrl.dev : config.baseImageUrl.pro;

// 定义点和划
const to = '.';
const ti = '-';

// 定义摩尔斯电码字典
const dict = {
    'а': [to, ti],
    'б': [ti, to, to, to],
    'в': [to, ti, ti],
    'г': [ti, ti, to],
    'д': [ti, to, to],
    'е': [to],
    'ж': [to, to, to, ti],
    'з': [ti, ti, to, to],
    'и': [to, to],
    'й': [to, ti, ti, ti],
    'к': [ti, to, ti],
    'л': [to, ti, to, to],
    'м': [ti, ti],
    'н': [ti, to],
    'о': [ti, ti, ti],
    'п': [to, ti, ti, to],
    'р': [to, ti, to],
    'с': [to, to, to],
    'т': [ti],
    'у': [to, to, ti],
    'ф': [to, to, ti, to],
    'х': [to, to, to, to],
    'ц': [ti, to, ti, to],
    'ч': [ti, ti, ti, to],
    'ш': [ti, ti, ti, ti],
    'щ': [ti, ti, to, ti],
    'ъ': [to, ti, ti, to, ti, to],
    'ы': [ti, to, ti, ti],
    'ь': [ti, to, to, ti],
    'э': [to, to, ti, to, to],
    'ю': [to, to, ti, ti],
    'я': [to, ti, to, ti], //32

    'a': [to, ti],
    'b': [ti, to, to, to],
    'c': [ti, to, ti, to],
    'd': [ti, to, to],
    'e': [to],
    'f': [to, to, ti, to],
    'g': [ti, ti, to],
    'h': [to, to, to, to],
    'i': [to, to],
    'j': [to, ti, ti, ti],
    'k': [ti, to, ti],
    'l': [to, ti, to, to],
    'm': [ti, ti],
    'n': [ti, to],
    'o': [ti, ti, ti],
    'p': [to, ti, ti, to],
    'q': [ti, ti, to, ti],
    'r': [to, ti, to],
    's': [to, to, to],
    't': [ti],
    'u': [to, to, ti],
    'v': [to, to, to, ti],
    'w': [to, ti, ti],
    'x': [ti, to, to, ti],
    'y': [ti, to, ti, ti],
    'z': [ti, ti, to, to],

    '0': [ti, ti, ti, ti, ti],
    '1': [to, ti, ti, ti, ti],
    '2': [to, to, ti, ti, ti],
    '3': [to, to, to, ti, ti],
    '4': [to, to, to, to, ti],
    '5': [to, to, to, to, to],
    '6': [ti, to, to, to, to],
    '7': [ti, ti, to, to, to],
    '8': [ti, ti, ti, to, to],
    '9': [ti, ti, ti, ti, to],

    '.': [to, to, to, to, to, to],
    ',': [to, ti, to, ti, to, ti],
    ':': [ti, ti, ti, to, to, to],
    ';': [ti, to, ti, to, ti, to],
    ')': [ti, to, ti, ti, to, ti],
    '(': [ti, to, ti, ti, to, ti],
    "'": [to, ti, ti, ti, ti, to],
    '"': [to, ti, to, to, ti, to],
    '-': [ti, to, to, to, to, ti],
    '/': [ti, to, to, ti, to],
    '?': [to, to, ti, ti, to, to],
    '!': [ti, ti, to, to, ti, ti],
    '@': [to, ti, ti, to, ti, to],

};

// 定义 Sound 类
class Sound {
    // constructor(context) {
    //     this.context = context;
    //     this.setup();
    // }
    constructor(context) {
        this.context = context;
        this.setup();
        this.currentChar = '';
        this.currentDotDash = '';
    }

    getCurrentCharInfo() {
        return {
            currentChar: this.currentChar,
            currentDotDash: this.currentDotDash
        };
    }
    setup() {
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.oscillator.type = 'sine';
    }
    play(freq, curTime) {
        this.oscillator.frequency.value = freq;
        this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
        this.oscillator.start(this.context.currentTime + curTime / 1000);
    }
    stop(durCoef, curTime, dotOrDash) {
        // console.log('哈哈哈stop',durCoef, curTime, dotOrDash)
        let duration = 0;
        if (dotOrDash === to) {
            duration = curTime / 1000 + durCoef / 1000 * 1;
        } else {
            duration = curTime / 1000 + durCoef / 1000 * 3;
        }
        this.oscillator.stop(this.context.currentTime + duration);
    }
}

const Morse2 = () => {
    const [textInput, setTextInput] = useState('');
    const [textOutput, setTextOutput] = useState('');
    const [dataDAD, setDataDAD] = useState([]);
    const [audioContext, setAudioContext] = useState(new (window.AudioContext || window.webkitAudioContext)());
    const [frequency, setFrequency] = useState(800); // 默认频率 800Hz
    const [durationCoefficient, setDurationCoefficient] = useState(100); // 默认持续时间系数 100
    const [isPlaying, setIsPlaying] = useState(false)
    const childRef = useRef();
    const [destination, setDestination] = useState('')
    const [times, setTimes] = useState([])
    const audioRef1 = useRef(null);
    const audioRef2 = useRef(null);

    // 使用 useState 创建音量状态
    const [volume1, setVolume1] = useState(0.5); // 初始音量设为 0.5
    const [volume2, setVolume2] = useState(0.5); // 初始音量设为 0.5


    useEffect(() => {
        return () => {
            // audioContext.close()
        }
    }, [])
    // 处理输入变化
    const handleInputChange = (e) => {
        // const value = e.target.value.toLowerCase();
        const value = '1234 9768 9807 6654 3421 7654 8787 7890 4352 7865 3456 9768 9807 6654 3421 7654 8787 7890 4352 7865 1234 9768 9807 6654 3421 7654 8787 7890 4352 7865 3456 9768 9807 6654 3421 7654 8787 7890 4352 7865 1234 9768 9807 6654 3421 7654 8787 7890 4352 7865 3456 9768 9807 6654 3421 7654 8787 7890 4352 7865 1234 9768 9807 6654 3421 7654 8787 7890 4352 7865 3456 9768 9807 6654 3421 7654 8787 7890 4352 7865 1234 9768 9807 6654 3421 7654 8787 7890 4352 7865 3456 9768 9807 6654 3421 7654 8787 7890 4352 7865'
        setDestination(value.split(' ').join(''))
        console.log('哈哈哈value', value.split(' ').join(''))
        setTextInput(value);
        const morseText = value.split(' ').map(word =>
            word.split('').map(letter => dict[letter]).join('  ')
        ).join('  /  ');
        setTextOutput(morseText);
        const data = value.split(' ').map(word =>
            word.split('').map(letter => dict[letter])
        );
        setDataDAD(data);
    };

    // 播放声音
    const playSound = (freqValue, durCoef, curTime, dotOrDash) => {
        const sound = new Sound(audioContext);
        sound.play(freqValue, curTime);
        sound.stop(durCoef, curTime, dotOrDash);
    };

    // 处理翻译按钮点击
    const handleTranslateClick = () => {
        if (isPlaying) {
            return
        }
        if (childRef.current) {
            childRef.current.handlePlay();
        }
        setIsPlaying(true)
        let curTime = 0;
        const curTimes = [];
        dataDAD.forEach((word, i) => {
            word.forEach((char, j) => {
                curTimes.push(curTime);
                char.forEach((dotOrDash, k) => {
                    // console.log('哈哈哈dataDAD',dataDAD,curTime,word,char,dotOrDash,i,j,k)
                    playSound(frequency, durationCoefficient, curTime, dotOrDash); // 使用示例频率值 800Hz 和持续时间系数 100
                    if (dotOrDash === to) {
                        curTime += durationCoefficient * 2; // точка + дается запас на паузу - 1 точка
                    } else {
                        curTime += durationCoefficient * 4; // тире + дается запас на паузу - 1 точка
                    }
                });
                curTime += durationCoefficient * 2; // между буквами
            });
            curTime += durationCoefficient * 7; // между словами
        });
        setTimes(curTimes)
        console.log('哈哈哈curTimes', curTimes)
    };

    // 处理翻译按钮点击
    const replay = () => {
        // 重置音频上下文
        if (isPlaying) {
            audioContext.close().then(() => {
                childRef.current.handleReset();
                //   console.log('哈哈哈delay',audioContext)
                setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
                setIsPlaying(false);
                //   handleTranslateClick();
            });
        }
    };
    const pause = () => {
        if (!isPlaying) {
            return
        }
        childRef.current.handlePause();
        audioContext.suspend()
    }

    const resume = () => {
        if (!isPlaying) {
            return
        }
        childRef.current.handlePlay();
        audioContext.resume()
    }

    // 处理频率变化
    const handleFrequencyChange = (e) => {
        setFrequency(parseInt(e.target.value));
    };

    // 处理持续时间系数变化
    const handleDurationCoefficientChange = (e) => {
        setDurationCoefficient(parseInt(e.target.value));
    };

    // 播放和暂停音频
    const playAudio = (audioRef) => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const pauseAudio = (audioRef) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    // 设置音量
    const setVolume = (audioRef, newVolume) => {
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // 音量控制按钮
    const increaseVolume = (audioRef) => {
        console.log('哈哈哈zen', audioRef.current.volume)
        let newVolume = audioRef.current.volume + 0.1;
        setVolume(audioRef, newVolume <= 1 ? newVolume : 1);
    };

    const decreaseVolume = (audioRef) => {
        console.log('哈哈哈jian', audioRef.current.volume)
        let newVolume = audioRef.current.volume - 0.1;
        setVolume(audioRef, newVolume >= 0 ? newVolume : 0);
    };

    return (
        <div id="bd">
            <h1>Morse</h1>
            <div className="go">
                <div className="elem_form elem_form-input">
                    <textarea value={textInput} onChange={handleInputChange} placeholder="原码" />
                </div>
                <div className="medium">
                    <div>
                        <label className="label_polz">调节频率
                            <input
                                className="polzunok"
                                id="frequencyRange"
                                type="range"
                                min="500"
                                max="1500"
                                step="1"
                                value={frequency}
                                onChange={handleFrequencyChange}
                            />
                        </label>
                        <label className="label_polz">调节速度
                            <input
                                className="polzunok"
                                id="durationCoefficient"
                                type="range"
                                min="10"
                                max="300"
                                step="10"
                                value={durationCoefficient}
                                onChange={handleDurationCoefficientChange}
                            />
                        </label>
                    </div>
                    <div className="elem_form elem_form-button">
                        <img src="images/стрелка.png" alt="" onClick={handleTranslateClick} />
                        <Button onClick={handleTranslateClick} disabled={isPlaying ? true : false}>{isPlaying ? '播放中' : '播放'}</Button>
                        <Button onClick={replay}>重置</Button>
                        <Button onClick={pause} disabled={isPlaying ? false : true}>暂停</Button>
                        <Button onClick={resume} disabled={isPlaying ? false : true}>继续播放</Button>
                    </div>
                </div>
                <TimeComponent ref={childRef} destination={destination} times={times} />
                <div className="elem_form elem_form-input">
                    <textarea value={textOutput} readOnly style={{ width: '1000px', height: '300px' }} />
                </div>
                <div>
                    <audio ref={audioRef1} src={baseUrl + '1.WAV'} volume={volume1} />
                    <button onClick={() => playAudio(audioRef1)}>Play Audio 1</button>
                    <button onClick={() => pauseAudio(audioRef1)}>Pause Audio 1</button>
                    <button onClick={() => increaseVolume(audioRef1)}>Increase Volume 1</button>
                    <button onClick={() => decreaseVolume(audioRef1)}>Decrease Volume 1</button>

                    <audio ref={audioRef2} src={baseUrl + '2.WAV'} volume={volume2} />
                    <button onClick={() => playAudio(audioRef2)}>Play Audio 2</button>
                    <button onClick={() => pauseAudio(audioRef2)}>Pause Audio 2</button>
                    <button onClick={() => increaseVolume(audioRef2)}>Increase Volume 2</button>
                    <button onClick={() => decreaseVolume(audioRef2)}>Decrease Volume 2</button>
                </div>

            </div>
        </div>
    );
};

export default Morse2;