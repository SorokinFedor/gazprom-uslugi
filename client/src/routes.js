import Admin from '../src/pages/Admin';
import Profile from '../src/pages/Profile';
import Gazprom from '../src/pages/Gazprom';
import Auth from '../src/pages/Auth';
import Agreement from '../src/pages/Agreement';
import AgreementList from '../src/pages/AgreementList'; 
import AgreementView from '../src/pages/AgreementView'; 
import PasswordReset from '../src/pages/PasswordReset';
import ConfirmCode from './pages/ConfirmCode';
import {
  ADMIN_ROUTE,
  PROFILE_ROUTE,
  GAZPROM_ROUTE,
  AGREEMENT_ROUTE,
  AGREEMENT_VIEW_ROUTE,
  AGREEMENT_CREATE_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  RESET_PASSWORD_ROUTE,
  CONFIRM_CODE
} from './utils/consts';

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
    authOnly: false,
  },
  {
    path: PROFILE_ROUTE,
    Component: Profile,
    authOnly: false,
  },
  {
    path: AGREEMENT_ROUTE,
    Component: AgreementList, 
    authOnly: false,
  },
  {
    path: AGREEMENT_VIEW_ROUTE,
    Component: AgreementView,
    authOnly: false,
  },
  {
    path: AGREEMENT_CREATE_ROUTE,
    Component: Agreement, 
    authOnly: false,
  },
];

export const publicRoutes = [
  {
    path: GAZPROM_ROUTE,
    Component: Gazprom,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: RESET_PASSWORD_ROUTE,
    Component: PasswordReset,
  },
  {
    path: CONFIRM_CODE,
    Component: ConfirmCode,
  },
];