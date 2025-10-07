import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        // Container Footer Utama: horizontal, responsive, dan background gelap
        <footer className="footer footer-center p-10 bg-base-300 text-base-content border-t-2 border-red-900 shadow-2xl mt-12">
            
            {/* Logo atau Nama Aplikasi */}
            <div className="flex flex-col items-center">
                <Link to="/" className="text-4xl font-extrabold text-red-900 transition-colors duration-300 hover:text-red-600">
                    BiosKocak
                </Link>
                <p className="text-sm mt-1 text-gray-500">Discover your next favorite movie or series.</p>
            </div>

            {/* Bagian Tautan (Interaktif) */}
            <nav className="grid grid-flow-col gap-8 text-lg font-semibold text-base-content">
                <Link 
                    to="/about" 
                    className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600"
                >
                    About Us
                </Link>
                <Link 
                    to="/privacy" 
                    className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600"
                >
                    Privacy Policy
                </Link>
                <Link 
                    to="/contact" 
                    className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600"
                >
                    Contact
                </Link>
                <Link 
                    to="/api-status" 
                    className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600"
                >
                    API Status
                </Link>
            </nav>

            {/* Bagian Ikon Media Sosial (Interaktif) */}
            <div className="grid grid-flow-col gap-6">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="text-2xl text-base-content transition-colors duration-300 hover:text-red-600 hover:scale-110">
                    <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="text-2xl text-base-content transition-colors duration-300 hover:text-red-600 hover:scale-110">
                    <FaInstagram />
                </a>
                <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer"
                   className="text-2xl text-base-content transition-colors duration-300 hover:text-red-600 hover:scale-110">
                    <FaGithub />
                </a>
            </div>

            {/* Informasi Hak Cipta dan Sumber Data */}
            <aside className="text-sm text-gray-500">
                <p>
                    Built with <FaHeart className="inline text-red-600 mx-1 animate-pulse" /> by BiosKocak Team.
                </p>
                <p className="mt-1">
                    Copyright © {currentYear} - All right reserved. Data provided by 
                    <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" 
                       className="text-red-600 font-semibold ml-1 link link-hover">
                        The Movie Database (TMDB)
                    </a>.
                </p>
            </aside>
        </footer>
    );
};

export default Footer;