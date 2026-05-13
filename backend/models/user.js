module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING, // Kita pakai teks biasa agar mudah dipelajari
    role: DataTypes.STRING      // Isinya nanti: 'admin' atau 'user'
  });
  return User;
};