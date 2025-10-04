import React from "react";
import { Link } from "react-router-dom";
import ListMovie from "../../components/List/listMovie/ListMovie";
import ListSeries from "../../components/List/listSeries/ListSeries";
import ListTrending from "../../components/List/listTrending/ListTrending";
import ListNowPlaying from "../../components/List/listNowPlaying/ListNowPlaying";
import Favorite from "../favorite/Favorite";

const HomeView = ({ trendingMovie, trailerKey, loading }) => {
    if (loading) return <p className="text-center text-red-900">⏳ Loading...</p>;

    return (
        <div className=" bg-base-100"> 
            
            {/* 🎬 Full Video Trailer */}
            {trailerKey && (
                // Wrapper ini harus FULL WIDTH dan menempel ke tepi layar
                <div className="relative w-[208vh] h-[90vh] overflow-hidden  ">
                    
                    {/* Video - Tetap object-cover */}
                    <iframe
                        id="ytPlayer" 
                        className="absolute top-0 left-0 w-full h-full object-cover" 
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&enablejsapi=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="autoplay; fullscreen; encrypted-media"
                        allowFullScreen
                    />

                    {/* Layer Gradient Hitam di Bawah Video */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-10"></div>


                    {/* Overlay Konten (Judul, Teks, Tombol) */}
                    {/* ✅ KONTROL Jarak Konten Teks di sini dengan padding */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end px-6 md:px-12 pb-12 z-20"> 
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            {trendingMovie?.title}
                        </h2>
                        <p className="text-gray-300 max-w-2xl mb-6 drop-shadow-md">{trendingMovie?.overview}</p>

                        {/* 🔘 Tombol Play dan My List */}
                        <div className="flex gap-3">
                            <Link
                                to={`/film/${trendingMovie?.id}`}
                                className="bg-red-900 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition"
                            >
                                ▶ Play
                            </Link>
                            <Link
                                to={"/favorite"}
                                className="bg-red-900 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition"
                            >
                                + My List
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* List Components */}
            {/* ✅ Wrapper baru untuk list, tambahkan padding horizontal di sini */}
            <div className="px-6 space-y-12 mt-10"> 
                <ListTrending />

                <ListMovie />
                
                <ListSeries />

                <ListNowPlaying />
            </div>
        </div>
    );
};

export default HomeView;