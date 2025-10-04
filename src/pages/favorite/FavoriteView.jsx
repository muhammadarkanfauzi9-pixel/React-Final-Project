// src/components/Favorite/FavoriteView.jsx

import React from 'react';
// Asumsi Anda memiliki komponen Card atau sejenisnya untuk menampilkan item
// import ItemCard from '../common/ItemCard'; 

const FavoriteView = ({ favorites, onRemove, hasFavorites }) => {

  const { films, tvs, people } = favorites;

  if (!hasFavorites) {
    return (
      <div className="text-center p-20 text-white">
        <h2 className="text-2xl mb-4">Daftar Favorite Anda Kosong</h2>
        <p className="text-gray-400">Tambahkan film, acara TV, atau orang favorit Anda!</p>
      </div>
    );
  }

  // Fungsi pembantu untuk merender daftar
  const renderList = (list, title, type) => (
    list.length > 0 && (
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">{title} ({list.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {list.map(item => (
            // Asumsi Card yang Anda gunakan memiliki tombol/opsi Remove
            // dan menerima item, type, dan onRemove
            <div key={item.id} className="relative group">
              {/* Tempatkan ItemCard atau markup kartu Anda di sini */}
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4 text-white">
                <p className="font-semibold">{item.title || item.name}</p>
                <p className="text-sm text-gray-400">{type}</p>
                <button
                  onClick={() => onRemove(item, type)} // Menggunakan handler dari props
                  className="mt-2 text-sm bg-red-600 hover:bg-red-700 transition p-2 rounded w-full"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  );

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-white mb-10">Daftar Favorit Saya</h1>

      {renderList(films, "Film Favorit", "films")}
      {renderList(tvs, "Acara TV Favorit", "tvs")}
      {renderList(people, "Orang/Aktor Favorit", "people")}

    </div>
  );
};

export default FavoriteView;