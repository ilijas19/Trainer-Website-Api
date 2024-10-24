const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJwt = createJwt({ payload: { user } });
  const refreshTokenTokenJwt = createJwt({
    payload: { user, refreshToken },
  });

  const oneDay = 1000 * 60 * 60 * 24;
  const tenDays = 1000 * 60 * 60 * 24 * 10;

  res.cookie("accessToken", accessTokenJwt, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.environment === "production",
  });

  res.cookie("refreshToken", refreshTokenTokenJwt, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + tenDays),
    secure: process.env.environment === "production",
  });
};

module.exports = { verifyToken, attachCookiesToResponse };
