module.exports = (sequelize, DataTypes) => {
  const Produk = sequelize.define('produk', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_produk: {
      type: DataTypes.STRING(50), 
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false,
      defaultValue: 0.00
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kategori: {
      type: DataTypes.STRING(50), 
      allowNull: true, 
    },
    tanggal_rilis: {
      type: DataTypes.DATEONLY, 
      allowNull: true,
    }
  }, {
   
    tableName: 'produk',     
    freezeTableName: true,  
    timestamps: false        
  });

  return Produk;
};