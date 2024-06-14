import React from "react";
import Card from "./Card.jsx";

const Content = () => {
    return (
        <section className="section-custom">
            <div className="container">
                <div className="row justify-content-center text-center">
                    <h2 className="section-title">
                        <span className="section-title-content">
                            My Applications
                        </span>
                    </h2>
                    <Card
                        title="Connect Four"
                        bg="gametime"
                        goto="connect4.html"
                    />
                    <Card
                        title="Computational Geometry Applet"
                        bg="gametime.jpeg"
                        goto="cgapplet.html"
                    />
                </div>
            </div>
        </section>
    );
};

export default Content;
