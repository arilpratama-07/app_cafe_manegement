const BASE_URL = 'http://localhost:5000'; // Port backend Anda

const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      return await response.json();
    } catch (error) {
      console.error('Error GET:', error);
    }
  },
  
  async post(endpoint, data) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Gagal menyimpan data');
      return await response.json();
    } catch (error) {
      console.error('Error POST:', error);
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Gagal mengupdate data');
      return await response.json();
    } catch (error) {
      console.error('Error PUT:', error);
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Gagal menghapus data');
      return await response.json();
    } catch (error) {
      console.error('Error DELETE:', error);
    }
  }
};

export default api;