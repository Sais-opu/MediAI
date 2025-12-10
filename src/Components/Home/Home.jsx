
import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import Banner from "./Banner";
import Dashboard from "../Dashboard/Dashboard.jsx";

const Home = () => {
    const { user } = useContext(AuthContext);

    // If user is logged in, show dashboard
    if (user) {
        return <Dashboard />;
    }

    // If user is not logged in, show public home page
    return (
        <div>
            <Banner></Banner>
        </div>
    );
};

export default Home;
