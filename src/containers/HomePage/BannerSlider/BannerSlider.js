import React, { Component } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './BannerSlider.scss'

class BannerSlider extends Component {
    render() {
        const images = [
            "https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png",
            "https://cdn.bookingcare.vn/fo/2024/03/15/094346-hoi-dap-cong-dong.png",
            "https://cdn.bookingcare.vn/fo/2023/09/07/141422-144204-dat-lich-kham-bookingcare-pharmacity.jpg",
            "https://cdn.bookingcare.vn/fo/2023/10/10/163557-dat-lich-cham-soc-wecare247.png"
        ];

        return (
            <div className='banner-slide-container'>
                <Fade duration={1000}
                    onChange={function noRefCheck() { }}
                    onStartChange={function noRefCheck() { }}>
                    <div className="each-slide">
                        <img src={images[0]} />
                    </div>
                    <div className="each-slide">
                        <img src={images[1]} />
                    </div>
                    <div className="each-slide">
                        <img src={images[2]} />
                    </div>
                    <div className="each-slide">
                        <img src={images[3]} />
                    </div>
                </Fade>
            </div >
        );
    }
};

export default BannerSlider;