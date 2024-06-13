import React from "react";

const Header = () => {
    // Create reference to store the DOM element containing the animation
    const el = React.useRef(null);

    React.useEffect(() => {
        const typed = new Typed(el.current, {
            strings: [
                "I am <span class='first-char'>T</span>Yeung, ",
                "<span class='first-char'>C</span>omputer <span class='first-char'>S</span>cience student",
                "<span class='first-char'>W</span>eb <span class='first-char'>D</span>eveloper",
                "<span class='first-char'>T</span>etris player",
            ],
            typeSpeed: 50,
            loop: true,
        });

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };
    }, []);

    return (
        <div className="header">
            <div className="container">
                <div className="row">
                    <div className="col-8 ps-5">
                        <div className="intro-name">
                            <span className="first-char">T</span>{" "}
                            <span className="first-char">Y</span>eung{" "}
                        </div>
                        <span className="intro" ref={el} />
                    </div>
                    <div className="col">
                        <div className="row align-items-center h-100">
                            <ul className="info">
                                <li>https://codeforces.com/profile/TYeung</li>
                                <li>scyeungaf@connect.ust.hk</li>
                                <li>https://github.com/yeungsinchun</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
