import React from "react";
import {Link} from "react-router";

export const Header = (props) => {
    return (
        <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    <ul className="nav navbar-nav">
                        <li><Link to={"/personal_information"} activeClassName={"active"}>Datos Personales</Link></li>
                        <li><Link to={"/email"} activeClassName={"active"}>Emails</Link></li>
                        <li><Link to={"/phone"} activeClassName={"active"}>Celulares</Link></li>
                        <li><Link to={"/password"} activeClassName={"active"}>Contraseña</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};