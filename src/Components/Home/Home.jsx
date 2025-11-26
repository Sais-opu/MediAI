import React from "react";

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-50 to-white">
            <div className="text-center p-6">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Welcome to MediCare
                </h1>
                <p className="text-gray-700 mb-6">
                    Providing world-class medical care with experienced doctors and modern facilities.
                </p>
                <button className="btn btn-primary btn-lg">Get Started</button>
            </div>
        </div>
    );
};

export default Home;
