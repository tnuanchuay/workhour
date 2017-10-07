import React from 'react'
import { Bar } from 'react-chartjs-2'

let graph = {
    labels: [],
    datasets: [{
        label: 'Hours',
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        data: []
    }]
}

export default class BarGraph extends React.Component {

    constructor(props) {
        super(props)
        const { data, labels } = props
        this.state = {
            label: labels || [],
            data: data
        }
    }
    
    componentDidMount() {
        graph.datasets[0].data = this.state.data || []
        graph.labels = this.state.label
        console.log('set cdm', graph.datasets)
    }
    
    componentWillReceiveProps(nextProps) {
        console.log('nextprops', nextProps.data!== this.props.data)
        if (nextProps.data && nextProps.data !== this.props.data) {
            this.setState({
                data: nextProps.data
            })
            graph.datasets[0].data = nextProps.data || []
        }
    }
    
    render() {
        console.log('state' , this.state)
        return (
            <Bar
                data={this.state.data}
                width={100}
                height={300}
                options={{
                    maintainAspectRatio: false
                }}
            />
        )
    }
}
