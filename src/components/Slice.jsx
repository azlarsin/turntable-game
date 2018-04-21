import React from 'react';
import { Motion, spring, presets } from 'react-motion';

class Slice extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.setState({
            loading: false
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.props.per, this.props.index);
    }

    render = () => {
        let { index, p, active, handleAnimate, handleDelete, half } = this.props;

        return (
            <Motion 
                key={ index }
                style={{
                    scale: spring(active ? 1.1 : 1, {stiffness: 1000, damping: 20})
                }}
            >
                {({ scale }) =>
                    <path
                        id={ 'pie-' + index }
                        d={ `M0 0 L${p.startPoint.x} ${p.startPoint.y} A${half} ${half} 0 ${p.large} 1 ${p.endPoint.x} ${p.endPoint.y}` } 
                        fill={ p.fill }
                        data-per={ p.per }
                        style={{
                            filter: active ? 'url(#shadow)' : null,
                            transform: `scale(${scale})`
                        }}
                        onMouseOver={ handleAnimate.bind(this, true, index) }
                        onDoubleClick={ handleDelete.bind(this, index) }
                        strokeWidth={ 1 }
                    />
                }
            </Motion>
        );
    }
}

export default Slice;