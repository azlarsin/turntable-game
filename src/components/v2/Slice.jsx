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

    render = () => {
        let { index, p, active, handleAnimate, half, rotate } = this.props;

        return (
            <Motion
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
                        onMouseOver={ handleAnimate.bind(this, true, index) }
                        style={{
                            filter: active ? 'url(#shadow)' : null,
                            transform: `scale(${rotate ? 1.1 : scale})` + (rotate ? ' rotateX(-180deg)' : '')
                        }}
                    />
                }
            </Motion>
        );
    }
}

export default Slice;