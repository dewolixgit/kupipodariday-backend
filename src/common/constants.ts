export const ERROR_MESSAGES = {
  userAlreadyExists:
    'Пользователь с таким email или username уже зарегистрирован',
  invalidCredentials: 'Неверные имя пользователя или пароль',
  wishNotFound: 'Подарок не найден',
  wishEditForbidden: 'Можно редактировать только свои подарки',
  priceChangeForbidden:
    'Стоимость изменить нельзя: уже есть желающие скинуться',
  wishlistNotFound: 'Подборка не найдена',
  profileEditForbidden: 'Нельзя редактировать чужой профиль',
  ownOfferForbidden: 'Нельзя вносить деньги на собственный подарок',
  wishIsFullyFunded: 'На подарок уже собрана вся сумма',
  amountTooBig: 'Сумма превышает остаток до полной стоимости',
  copyOwnForbidden: 'Нельзя копировать свой собственный подарок',
  wishDeleteForbidden: 'Нельзя удалить чужой подарок',
  wishHasOffers: 'Нельзя удалить подарок: уже есть желающие скинуться',
  wishlistEditForbidden: 'Нельзя изменять чужую подборку',
  wishlistDeleteForbidden: 'Нельзя удалять чужую подборку',
  wishIdsEmpty: 'Нужно передать хотя бы один itemId',
  offerNotFound: 'Предложение не найдено',
};

export const SUCCESS_MESSAGES = {
  wishDeleted: 'Подарок удалён',
  wishlistDeleted: 'Подборка удалена',
};

export const DEFAULTS = {
  user: {
    about: 'Пока ничего не рассказал о себе',
    avatar: 'https://i.pravatar.cc/300',
  },
};

export const POSTGRES_ERROR_CODE = {
  uniqueViolation: '23505',
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
