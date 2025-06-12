import React, { useRef } from "react";

const Sidebar = ({ users, user, socket }) => {
  const sideBarRef = useRef(null);

  const openSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.style.left = "0";
    }
  };
  const closeSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.style.left = "-100%";
    }
  };

  return (
    <>
      <button
        className="fixed top-6 left-6 z-50 bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-200"
        onClick={openSideBar}
      >
        Users
      </button>
      <div
        ref={sideBarRef}
        className="fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-blue-900 to-blue-700 bg-opacity-95 shadow-2xl z-40 transition-all duration-300"
        style={{
          left: "-100%",
        }}
      >
        <div className="flex flex-col h-full">
          <button
            className="w-full py-2 bg-blue-600 text-white font-bold rounded-b-lg hover:bg-blue-500 transition-colors"
            onClick={closeSideBar}
          >
            Close
          </button>
          <div className="flex-1 overflow-y-auto mt-6 px-2">
            <h2 className="text-center text-white font-semibold mb-4 text-lg tracking-wide">
              Online Users
            </h2>
            {users.map((usr, index) => (
              <p
                key={index}
                className={`py-2 rounded text-center mb-2 ${
                  usr.id === socket.id
                    ? "bg-blue-500 text-yellow-200 font-bold"
                    : "text-white bg-blue-800"
                }`}
              >
                {usr.username}
                {usr.id === socket.id && " (You)"}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
