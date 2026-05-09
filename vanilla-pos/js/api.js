const BASE_URL = 'http://localhost:5000';

export default {
  async get(url) {
    try {
      const res = await fetch(BASE_URL + url);
      if (!res.ok) throw new Error('Gagal mengambil data');
      return await res.json();
    } catch (err) {
      console.error('Error GET:', err);
    }
  },

  async post(url, data) {
    try {
      // Deteksi otomatis: Apakah ini Foto (FormData) atau Teks (JSON)?
      const isFormData = data instanceof FormData;
      
      const options = {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data)
      };

      // Jika BUKAN foto, tambahkan header JSON
      if (!isFormData) {
        options.headers = { 'Content-Type': 'application/json' };
      }

      const res = await fetch(BASE_URL + url, options);
      if (!res.ok) throw new Error('Gagal mengirim data');
      return await res.json();
    } catch (err) {
      console.error('Error POST:', err);
    }
  },

  async put(url, data) {
    try {
      const isFormData = data instanceof FormData;
      
      const options = {
        method: 'PUT',
        body: isFormData ? data : JSON.stringify(data)
      };

      if (!isFormData) {
        options.headers = { 'Content-Type': 'application/json' };
      }

      const res = await fetch(BASE_URL + url, options);
      if (!res.ok) throw new Error('Gagal update data');
      return await res.json();
    } catch (err) {
      console.error('Error PUT:', err);
    }
  },

  async delete(url) {
    try {
      const res = await fetch(BASE_URL + url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus data');
      return await res.json();
    } catch (err) {
      console.error('Error DELETE:', err);
    }
  }
};