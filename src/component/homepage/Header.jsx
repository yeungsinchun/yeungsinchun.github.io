import React from "react";

const Header = () => {
    // Create reference to store the DOM element containing the animation
    const el = React.useRef(null);

    React.useEffect(() => {
        const typed = new Typed(el.current, {
            strings: [
                "I am <span class='first-char'>T</span>Yeung, ",
                "<span class='first-char'>C</span>omputer <span class='first-char'>S</span>cience student",
                "<span class='first-char'>C</span>ompetitive <span class='first-char'>P</span>rogrammer",
                "<span class='first-char'>T</span>etris player",
                "<span class='first-char'>H</span>ate software development :(",
                "<span class='first-char'>E</span>njoy theorectical CS",
                "<span class='first-char'>W</span>orking on Connect-4 Solver",
                "<span class='first-char'>L</span>earning about ZKP",
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
                    <div className="col justify-content-center d-flex">
                        <div>
                            <div className="intro-name">
                                <span className="first-char">T</span>{" "}
                                <span className="first-char">Y</span>eung{" "}
                            </div>
                            <span className="intro" ref={el} />
                        </div>
                    </div>
                    <div className="col justify-content-center d-flex">
                        <div className="row align-items-center h-100 m-0">
                            <ul className="info m-0">
                                <li>
                                    <i className="fa-solid fa-code fa-fw"></i>
                                    &nbsp; https://codeforces.com/profile/TYeung
                                </li>
                                <li>
                                    <i class="fa-regular fa-envelope fa-fw"></i>
                                    &nbsp; scyeungaf@connect.ust.hk
                                </li>
                                <li>
                                    <i class="fa-brands fa-github fa-fw"></i>
                                    &nbsp; https://github.com/yeungsinchun
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
