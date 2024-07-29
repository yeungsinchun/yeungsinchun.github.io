import * as React from "react";
import { useEffect } from "react";

const App = () => {
    useEffect(() => {
        if (typeof window?.MathJax !== "undefined") {
            window.MathJax.typeset();
        }
    }, []);

    return (
        <div className="container">
            <h1> Generating Functions </h1>
            <div>
                A generating function \( {`\\sum_{i=0}^{n} a_{i}x^{i}`} \)
                encapsulates the sequence \(a_i\).
            </div>
        </div>
    );
};

export default App;
