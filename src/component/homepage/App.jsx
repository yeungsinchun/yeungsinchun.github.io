import React from "react";
import Nav from "./Nav.jsx";
import Header from "./Header.jsx";
import Content from "./Content.jsx";

const App = () => {
    return (
        <>
            <Header />
            <hr className="separate"/>
            <Content />
        </>
    );
};

export default App;
