import { $authHost, $host } from "./index";

export const registration = async ({
  first_name,
  last_name,
  middle_name,
  date_of_birth,
  phone_number,
  email,
  snils,
  password,
}) => {
  const { data } = await $host.post('/api/auth/registration', {
    first_name,
    last_name,
    middle_name,
    date_of_birth,
    phone_number,
    email,
    snils,
    password, 
  });
  return data;
};
export const login = async (email, password) => {
  const { data } = await $host.post('/api/auth/login', { email, password });
  console.log('Ответ от сервера в login:', data);
  return data;
};
export const check = async () => {
  const { data } = await $authHost.get('/api/auth/registration');
  return data;
};