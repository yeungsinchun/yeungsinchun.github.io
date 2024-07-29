import React from "react";
import Card from "./Card.jsx";

const Content = () => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div
                            id="list-example-content"
                            data-bs-spy="scroll"
                            data-bs-target="#list-example"
                            data-bs-offset="0"
                            data-bs-smooth-scroll="true"
                            tabIndex="0"
                        >
                            <section className="section-custom">
                                <div className="row justify-content-center">
                                    <h2 id="games" className="section-title">
                                        Games
                                    </h2>
                                    <span>
                                        Some games / applets I wrote for fun{" "}
                                    </span>
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
                                        text="Computational Geometry Applet under development"
                                    />
                                    <Card
                                        title="Tetris"
                                        bg="gametime.jpeg"
                                        goto="cgapplet.html"
                                        text="Tetris game under development"
                                    />
                                </div>
                            </section>
                            <section className="section-custom">
                                <div className="row justify-content-center">
                                    <h2 id="blogs" className="section-title">
                                        Weekly Blogs
                                    </h2>
                                    <span>
                                        Writing about virtually anything
                                    </span>
                                    <Card
                                        title="Development Diary"
                                        bg="gametime"
                                        goto="dev_diary.html"
                                    />
                                    <Card
                                        title="Codeforces writeups"
                                        bg="gametime.jpeg"
                                        goto="cgapplet.html"
                                    />
                                    <Card
                                        title="Placeholder"
                                        bg="gametime.jpeg"
                                        goto="cgapplet.html"
                                    />
                                </div>
                            </section>
                            <section className="section-custom">
                                <div className="row justify-content-center">
                                    <h2
                                        id="exercises"
                                        className="section-title"
                                    >
                                        Exercises
                                    </h2>
                                    <span>
                                        Some exercises I made (with solution)
                                    </span>
                                    <Card
                                        title="C++17 Template Exercises"
                                        bg="gametime"
                                        goto="dev_diary.html"
                                    />
                                    <Card
                                        title="Placeholder"
                                        bg="gametime.jpeg"
                                        goto="cgapplet.html"
                                    />
                                    <Card
                                        title="Placeholder"
                                        bg="gametime.jpeg"
                                        goto="cgapplet.html"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className="col-3 d-none d-md-block">
                        <div
                            className="list-group sticky-top p-2 list-group-flush"
                            id="list-example"
                        >
                            <a
                                href="#games"
                                className="list-group-item list-group-item-action"
                            >
                                Games / Applets
                            </a>
                            <a
                                href="#blogs"
                                className="list-group-item list-group-item-action"
                            >
                                Blogs
                            </a>
                            <a
                                href="#exercises"
                                className="list-group-item list-group-item-action"
                            >
                                Exercises
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Content;
