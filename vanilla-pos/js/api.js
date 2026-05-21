const BASE_URL = 'https://app-cafe-manegement.vercel.app/api'; // Ganti dengan URL backend Anda

export default {

  // Mengambil data dari backend
  async get(url) {
    try {
      const res = await fetch(BASE_URL + url);

      if (!res.ok)
        throw new Error('Gagal mengambil data');

      return await res.json();

    } catch (err) {
      console.error('Error GET:', err);
    }
  },

  // Menambah data baru
  async post(url, data) {
    try {

      // Mengecek apakah data berupa FormData
      const isFormData = data instanceof FormData;

      const options = {
        method: 'POST',

        // Jika FormData langsung kirim
        // Jika bukan ubah menjadi JSON
        body: isFormData
          ? data
          : JSON.stringify(data)
      };

      // Tambahkan header JSON jika bukan FormData
      if (!isFormData) {
        options.headers = {
          'Content-Type': 'application/json'
        };
      }

      const res = await fetch(BASE_URL + url, options);

      if (!res.ok)
        throw new Error('Gagal mengirim data');

      return await res.json();

    } catch (err) {
      console.error('Error POST:', err);
    }
  },

  // Mengupdate data
  async put(url, data) {
    try {

      const isFormData = data instanceof FormData;

      const options = {
        method: 'PUT',
        body: isFormData
          ? data
          : JSON.stringify(data)
      };

      if (!isFormData) {
        options.headers = {
          'Content-Type': 'application/json'
        };
      }

      const res = await fetch(BASE_URL + url, options);

      if (!res.ok)
        throw new Error('Gagal update data');

      return await res.json();

    } catch (err) {
      console.error('Error PUT:', err);
    }
  },

  // Menghapus data
  async delete(url) {
    try {

      const res = await fetch(BASE_URL + url, {
        method: 'DELETE'
      });

      if (!res.ok)
        throw new Error('Gagal menghapus data');

      return await res.json();

    } catch (err) {
      console.error('Error DELETE:', err);
    }
  }
};