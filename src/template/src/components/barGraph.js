import React from 'react'
import { Bar } from 'react-chartjs-2'

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
