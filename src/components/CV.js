import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';

const MARGIN_SIZE = 100;

export default class CV extends Component {
    constructor(props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    state = {
        docHeight: 0,
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        this.setState({ docHeight: document.documentElement.clientHeight - MARGIN_SIZE });
    }

    render() {
        const { docHeight } = this.state;
        const style = {
            height: docHeight,
        };
        return (
            <Grid className="cv-grid">
                <a href="/cv.pdf" download="sindri-gudmundsson-cv.pdf">Download CV</a>
                <object data="/cv.pdf" type="application/pdf" style={style}>
                    <embed src="/cv.pdf" type="application/pdf" />
                </object>
            </Grid>
        );
    }
}
