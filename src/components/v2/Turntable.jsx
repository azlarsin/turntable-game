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
            r: size / 2,
            loaded: false
        };

        this.defaultStye = {
            translateX: 0,
            translateY: 0
        };
    }

    componentWillMount = () => {
        this.__init([
            10,
            20,
            // 30,
            // 40
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
                stiffness: type === 'down' ? 50 : 1
            });
        }
    }

    componentDidMount = () => {
        // setTimeout(() => {
        //     this.__init([
        //         20,20
        //     ]);
        // }, 5000);
    }

    __init = (arr = []) => {
        let newArr = [];
        let acc = 0;
        const sum = arr.reduce((a,b) => a + b, 0);

        arr.forEach((v) => {
            let startPoint = getCoordinatesForPercent(acc / sum, this.state.r); 

            acc += v;
            
            let relativePoint = {
                endPoint: getCoordinatesForPercent(acc / sum, this.state.r),
                startPoint,
                large: v >= (sum / 2) ? 1 : 0,
                fill: randomColor(),
                acc: acc - v,
                v: v
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
        if(!this.state.loaded) {
            return ;
        }
        setTimeout(() => {
            this.setState({
                animate: animateState,
                index: index
            });
        }, delay);
    }

    loaded = () => {
        this.setState({
            loaded: true
        });
    }

    render = () => {
        const { newArr, sum, size } = this.state;

        const half = size / 2;

        if(newArr.length === 0) {
            return <svg></svg>;
        }
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

                { newArr.map((p, index) => {                                                
                    return (
                        <Slice
                            index={ index }
                            active={ index === this.state.index && this.state.animate }
                            half={ half }
                            p={p}
                            handleAnimate={ this.handleAnimate }
                            key={ 'path-' + index }
                        />
                    );
                }
                )}

                <use 
                    xlinkHref={ this.state.animate ? ('#pie-' + this.state.index) : null }
                    onMouseLeave={ this.handleAnimate.bind(this, false, this.state.index) }
                />

                <Motion 
                    style={{
                        v: spring(0, {stiffness: this.state.stiffness, damping: 20})
                    }}
                    defaultStyle={{ v: sum }}
                    onRest={ this.loaded }
                >
                    { ({ v }) => {                        
                        return (
                            <Slice
                                index={ null }
                                active={ false }
                                half={ half }
                                p={ {
                                    startPoint: getCoordinatesForPercent(1, this.state.r),
                                    endPoint: getCoordinatesForPercent(v / sum, this.state.r),
                                    large: v >= (sum / 2) ? 1 : 0,
                                    fill: 'white',
                                } }
                                handleAnimate={ () => {} }
                                rotate={ true }
                            />
                        );
                    }

                    }
                </Motion>
            </svg>
        
        );
    }
}

export default Turntable;