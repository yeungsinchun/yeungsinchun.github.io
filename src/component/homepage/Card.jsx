import React from "react";
import gametime from "../../image/gametime.jpeg";

const Card = ({ title, bg, goto, text }) => {
    return (
        <div className="card card-custom">
            <img className="card-img-top" src={gametime} alt="Card image cap" />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                {text}
                <p className="card-text"></p>
                <a href={goto} className="btn btn-primary">
                    Go somewhere
                </a>
            </div>
        </div>
    );
};

export default Card;
