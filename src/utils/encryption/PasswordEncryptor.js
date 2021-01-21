import bcrypt from "bcrypt";

const passwordEncryptor = async (password) => {
  return await bcrypt.hash(password, parseInt(process.env.ENCRYPTION_SALT));
};

export default passwordEncryptor;
