export const ERROR_MESSAGES = {
  userAlreadyExists:
    'Пользователь с таким email или username уже зарегистрирован',
  invalidCredentials: 'Неверные имя пользователя или пароль',
  wishNotFound: 'Подарок не найден',
  wishEditForbidden: 'Можно редактировать только свои подарки',
  priceChangeForbidden:
    'Стоимость изменить нельзя: уже есть желающие скинуться',
  wishlistNotFound: 'Подборка не найдена',
};

export const DEFAULTS = {
  user: {
    about: 'Пока ничего не рассказал о себе',
    avatar: 'https://i.pravatar.cc/300',
  },
};

export const ENV_KEYS = {
  dbHost: 'DB_HOST',
  dbPort: 'DB_PORT',
  dbUser: 'DB_USER',
  dbPass: 'DB_PASS',
  dbName: 'DB_NAME',
  jwtSecret: 'JWT_SECRET',
  jwtExpiresIn: 'JWT_EXPIRES_IN',
  bcryptSaltRounds: 'BCRYPT_SALT_ROUNDS',
  port: 'PORT',
};
