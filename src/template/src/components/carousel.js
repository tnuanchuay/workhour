import React, { Component } from 'react';

class Carousel extends Component {
    render() {
        return (
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="https://www.apple.com/th/apple-music/images/membership/og_image_membership.png?201707192157" alt="First slide" />
                    </div>
                </div>
            </div>
        )
    }
}

export default Carousel