import React from "react";
import { Lock, LogOut, ShoppingCart, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  const isAdmin = false;

  return (
    <header className="bg-opacity-90 fixed top-0 left-0 z-40 w-full border-b border-emerald-800 bg-gray-900 shadow-lg backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            to={"/"}
            className="flex items-center space-x-2 text-2xl font-bold text-emerald-400"
          >
            E-commerce
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
            >
              Home
            </Link>

            {user && (
              <Link
                to={"/cart"}
                className="group relative flex items-center text-gray-300 transition duration-300 ease-in-out hover:text-emerald-400"
              >
                <ShoppingCart
                  className="mr-1 inline-block group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white transition duration-300 ease-in-out group-hover:bg-emerald-400">
                  3
                </span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/admin"}
                className="flex items-center rounded-md bg-emerald-700 px-3 py-1 font-medium text-white transition duration-300 ease-in-out hover:bg-emerald-600"
              >
                <Lock className="mr-1 inline-block" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button className="flex items-center rounded-md bg-gray-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-600">
                <LogOut size={18} />
                <span className="ml-2 hidden sm:inline">Log out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-emerald-700"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign up
                </Link>

                <Link
                  to={"/signup"}
                  className="flex items-center rounded-md bg-gray-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-700"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
