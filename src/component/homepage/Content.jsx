import React from "react";
import Card from "./Card.jsx";

const Content = () => {
    return (
        <>
            <section className="section-custom">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <h2 className="section-title">
                            <span className="section-title-content">Games</span>
                        </h2>
                        <Card
                            title="Connect Four With Optimal A.I."
                            bg="gametime"
                            goto="connect4.html"
                            text="Get four in a row to win the game! Try to play with an unbeatable A.I. running alpha-beta pruning!"
                        />
                        <Card
                            title="Computational Geometry Applet"
                            bg="gametime.jpeg"
                            goto="cgapplet.html"
                        />
                    </div>
                </div>
            </section>
            <section className="section-custom">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <h2 className="section-title">
                            <span className="section-title-content">Blogs</span>
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
        </>
    );
};

export default Content;
