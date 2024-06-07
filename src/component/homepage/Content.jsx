import React from "react";
import Card from "./Card.jsx";

const Content = () => {
    return (
        <div className="container">
            <div className="row justify-content-center text-center">
                <Card
                    title="Connect Four"
                    bg="gametime.jpeg"
                    goto="connect4.html"
                />
                <Card />
                <Card />
            </div>
        </div>
    );
};

export default Content;
