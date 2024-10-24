const createTokenUser = (user) => {
  return {
    userId: user._id,
    role: user.role,
    name: user.firstName + " " + user.lastName,
    email: user.email,
  };
};

module.exports = createTokenUser;
