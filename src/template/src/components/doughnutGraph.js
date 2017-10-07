import React from 'react'
import { Doughnut } from 'react-chartjs-2'

export default class DoughnutGraph extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {
                data: {
                    average: 0.0,
                    datasets: [],
                    labels: []
                }
            }
        }
    }
    
    componentDidMount() {
        
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data !== this.props.data) {
            this.setState({
                data: nextProps
            })
            console.log('nextprops', this.state)
        }
    }
    
    render() {
        console.log('render state' , this.state.data.data)
        return (
            <div>
                <div className="d-flex justify-content-end lead">Avg: {this.state.data.data.average.hour}:{this.state.data.data.average.min}:{this.state.data.data.average.sec}</div>
                <Doughnut
                    data={this.state.data.data}
                />
            </div>
        )
    }
}