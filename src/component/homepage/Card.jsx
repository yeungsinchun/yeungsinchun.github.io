import React from "react";
import gametime from "../../image/gametime.jpeg";

const Card = ({ title, bg, goto }) => {
    return (
        <div className="card card-custom">
            <img className="card-img-top" src={gametime} alt="Card image cap" />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                </p>
                <a href={goto} className="btn btn-primary">
                    Go somewhere
                </a>
            </div>
        </div>
    );
};

export default Card;
