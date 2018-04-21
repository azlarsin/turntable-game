import React from 'react';

import { StaggeredMotion, Motion, spring, presets } from 'react-motion';

import Slice from './Slice';
import { getCoordinatesForPercent, randomColor } from '@/util';

require('@/assets/style/turntable.scss');

class Turntable extends React.Component {
    constructor(props) {
        super(props);
        
        const size = this.props.size || 400;

        this.state = {
            animate: false,
            index: null,
            newArr: [],
            sum: 0,
            stiffness: 1,
            size,
            r: size / 2
        };

        this.defaultStye = {
            translateX: 0,
            translateY: 0
        };
    }

    componentWillMount = () => {
        this.__init_v2([
            10,
            20,
            // 30,
            // 40,
            // 50,
            // 50,
            // 50,
            // 50,
            // 50,
            // 50,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100,
            // Math.random(0,1) * 100
        ]);


        document.body.addEventListener("keydown", this.__bodyKeyDown.bind(this, 'down'), true);
        document.body.addEventListener("keyup", this.__bodyKeyDown.bind(this, 'up'), true);
    }

    __bodyKeyDown = (type, e) => {
        let keyCode = e.keyCode,
            cmdHeld = this.context.platform === 'darwin' ? e.metaKey : e.ctrlKey,
            shiftHeld = e.shiftKey;

        if(e.keyCode === 83) {
            this.setState({
                stiffness: type === 'down' ? 100 : 1
            });
        }

        if(e.keyCode === 82 && type === 'down') {
            this.__init_v2(new Array(Math.round(Math.random() * 15)).fill(Math.random(0,1) * 100));
        }
    }

    componentDidMount = () => {
        // setTimeout(() => {
        //     this.__init([
        //         90,
        //         5,
        //         2.5,
        //         2.5
        //     ]);
        // }, 2000);
    }

    __init_v2 = (slices = []) => {
        let nowSlices= this.state.newArr;
        let nowSum = this.state.sum;
        let newSlices = [];

        const sum = slices.reduce((a,b) => a + b, 0);

        for(let i = 0;i < Math.max(nowSlices.length, slices.length);i++) {
            let prevS = nowSlices[i];
            let newV = (slices[i] ? slices[i] : 0) / sum;
        
            newSlices.push({
                fill: prevS ? prevS.fill : randomColor(),
                v: newV * (nowSum ? nowSum : sum),
                animateV: (prevS && prevS.animateV) ? prevS.animateV : 0,
                prevEnd: (prevS && prevS.prevEnd) ? prevS.prevEnd : 0
            });
        }
    
        this.setState({
            newArr: newSlices,
            sum: nowSum ? nowSum : sum,
            index: null
        });
    }

    __init = (arr = []) => {
        let prevArr = this.state.newArr;
        let newArr = [];
        let acc = 0;
        const sum = arr.reduce((a,b) => a + b, 0);

        arr.forEach((v, i) => {
            // let startPoint = getCoordinatesForPercent(acc / sum, this.state.r);

            let prevP = prevArr[i];

            acc += v;
            
            let relativePoint = {
                // endPoint,
                // startPoint,
                // large: v >= (sum / 2) ? 1 : 0,
                fill: prevP ? prevP.fill : randomColor(),
                stroke: randomColor(),
                acc: acc - v,
                v: v,
                animateV: 0
            };

            newArr.push(relativePoint);
        });

        this.setState({
            newArr,
            sum,
            index: null
        });
    }

    handleAnimate = (animateState, index = null, delay = 0) => {
        setTimeout(() => {
            this.setState({
                animate: animateState,
                index: index
            });
        }, delay);
    }

    handleDelete = (i = null) => {
        this.setState({
            sum: this.state.sum - this.state.newArr[i].v
        });
    }

    __getDefaultStyles = (newArr) => {
        return newArr.map((p) => {
            return {
                v: p.animateV || 0,
                prevEnd: p.prevEnd || 0
            };
        });
    }

    __getStyle = (prevStyles) => {
        const newArr = this.state.newArr;
        
        let acc = 0;
        
        const endValue = newArr.map((_, i) => {
            let p = newArr[i];

            let prevStyle = i > 0 ? prevStyles[i - 1] : {};
            // let prevEnded = i === 0 ? 
            //     true 
            //     : 
            //     (Math.abs(prevStyle.v - p.acc)  < this.state.newArr.length / 2)
            // ;

            // let realV = p.v + p.acc;

            let prevV = prevStyle && prevStyle.v ? prevStyle.v : 0;

            acc += prevV;


            return {
                v: spring(p.v, {stiffness: this.state.stiffness, damping: 20}),
                prevEnd: acc
            };
        });

        // const endValue = newArr.map((_, i) => {
        //     // let start
        // });

        return endValue;
    }

    render = () => {
        const { newArr, sum, size } = this.state;

        const half = size / 2;

        if(newArr.length === 0) {
            return <svg></svg>;
        }
        
        return (
        
            <StaggeredMotion
                defaultStyles={ this.__getDefaultStyles(newArr) }
                styles={ this.__getStyle }
                key={ newArr.length }
            >
                {styles => {
                    return (
                        <svg 
                            width={ size } height={ size } 
                            className={ 'turntable' } 
                            viewBox={ `-${half} -${half} ${size} ${size}` }
                        >
                            <defs>
                                <filter id="shadow">
                                    <feDropShadow stdDeviation="1"/>
                                </filter>
                            </defs>
                            <rect 
                                x={ -half } 
                                y={ -half }
                                width={ size }
                                height={ size }
                                fill='rgba(0,0,0,0)' 
                                onMouseOver={ this.handleAnimate.bind(this, false, this.state.index) }
                            />

                            { styles.map(({ v, prevEnd }, i) => {

                                if(!v) {
                                    console.log(newArr);
                                    return null;
                                }

                                let p = { ...newArr[i] };
                                
                                newArr[i].animateV = v;
                                newArr[i].prevEnd = prevEnd;

                                return (
                                    <Slice 
                                        index={ i }
                                        active={ i === this.state.index && this.state.animate }
                                        half={ half }
                                        p={{
                                            ...p,
                                            large: (v) >= (sum / 2) ? 1 : 0,
                                            startPoint: getCoordinatesForPercent(prevEnd / this.state.sum, half),
                                            endPoint: getCoordinatesForPercent((prevEnd + v) / this.state.sum, half)
                                        }}
                                        handleAnimate={ this.handleAnimate }
                                        handleDelete={ this.handleDelete }
                                        key={ 'path-' + i }
                                        per={ v }
                                    />
                                );
                            }

                            )}
                            <use 
                                xlinkHref={ this.state.animate ? ('#pie-' + this.state.index) : null }
                                onMouseLeave={ this.handleAnimate.bind(this, false, this.state.index) }
                            />

                            <text x={ 200 } y={ -200 } style={{ transform: 'rotate(90deg)' }}>
                                { 'now slices:' + newArr.filter(p => p.v !== 0).length }
                            </text>
                        </svg>
                    );
                }
                    
                }
            </StaggeredMotion>
        
        );
    }
}

export default Turntable;