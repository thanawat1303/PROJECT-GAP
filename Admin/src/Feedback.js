import React , {Component} from "react";

export default class Feedback extends Component {
    render() {
        return(
            <div id="body-feedback">
                <div id="box-feedback-img">
                    <img id="img-feedback-correct"  src="/correct-icon-green.svg"></img>
                    <img id="img-feedback-error"  src="/error-cross-svgrepo-com.svg"></img>
                </div>
                <div id="curcle-feedback"></div>
            </div>
        )
    }
}