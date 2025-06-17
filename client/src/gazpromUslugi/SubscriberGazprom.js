import { makeAutoObservable } from "mobx";

export default class SubscriberGazprom {
    constructor() {
        this._user = {
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            phone_number: '',
            subscriber_id: null,
            role: '',
        };
        this._token = ''; 
        this._isAuth = false;
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser (user) {
        console.log('Устанавливаем пользователя:', user);
        this._user = {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            middle_name: user.middle_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            subscriber_id: user.subscriber_id || user.id || null,
            role: user.role || '',
        };
    }
    
    setToken(token) { 
        this._token = token;
    }

    clearUser () {
        this._user = {
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            phone_number: '',
        };
        this._token = '';
        this._isAuth = false;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get token() {
        return this._token;
    }
}