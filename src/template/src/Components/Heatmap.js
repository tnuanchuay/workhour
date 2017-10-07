import React, { Component } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap';
import moment from 'moment'

const customTooltipDataAttrs = { 'data-toggle': 'tooltip' };

class Heatmap extends Component {
    render() {
        return (
            <div className="container">
                <CalendarHeatmap
                    endDate={new Date()}
                    numDays={365}
                    titleForValue={(value) => `hi`}
                    tooltipDataAttrs={customTooltipDataAttrs}
                    classForValue={(value) => {
                        if (!value) {
                            return 'color-scale-1';
                        }
                        return `color-scale-${value.count}`;
                    }}
                />
            </div>
        );
    }
}

export default Heatmap