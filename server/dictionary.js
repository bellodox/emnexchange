'use strict';

exports.object = {
    c : function(strCoin) {
        try {
            return exports.object[strCoin][exports.object.coin];
        }
        catch(e) {
            return strCoin;
        }
    },
    l : function(str) {
        try {
            return this.dict['_words_'][str][this.dict.lang];
        }
        catch(e) {
            return str;
        }
    },
    setLanguage : function(lang) {
        if (lang == 'en')
            this.lang = 0;
        if (lang == 'ru')
            this.lang = 1;
    },
    'lang' : 0,
    '_words_' : {
        'Buy' : ['Buy', 'Comprar'],
        'Sell' : ['Sell', 'Vender'],
        'buy' : ['buy', 'Comprar'],
        'Faucet' : ['Faucet', 'Faucet'],
        'Forum' : ['Forum', 'Foro'],
        'Market' : ['Market', 'Mercados'],
        'Update' : ['Update', 'Actualizar'],
        'Username' : ['Username', 'Nombre de Usuario'],
        'Current Password' : ['Current Password', 'Password Actual'],
        'New Password' : ['New Password', 'Nuevo Password'],
        'New Password (confirm)' : ['New Password (confirm)', 'Nuevo Password (confirmar)'],
        'Amount' : ['Amount', 'Cantidad'],
        'Price' : ['Price', 'Precio'],
        'Profile' : ['Profile', 'Perfil'],
        'Deposit' : ['Deposit', 'Depositar'],
        'Withdraw' : ['Whitdraw', 'Retirar'],
        'History' : ['History', 'Historial'],
        'Your Balance:' : ['Your Balance:', 'Tu Saldo'],
        'Highest Ask:' : ['Highest Ask:', 'Oferta de Venta mas Alta'],
        'Highest Bid:' : ['Highest Bid:', 'Oferta de Compra mas Alta'],
        'From Blockchain' : ['From Blockchain', 'Blockchain'],
        'Add Coin' : ['Add Coin', 'Agregar Moneda'],
        'Support' : ['Support', 'Soporte'],
        'Create Assets' : ['Create Assets', 'Crear Moneda'],
        'Affiliate' : ['Affiliate', 'Afiliados'],
        'Fees' : ['Fees', 'Tasas'],
        'Logout' : ['Logout', 'Cerrar Sesion'],
        'Login' : ['Login', 'Iniciar Sesion'],
        'Reserved in Orders' : ['Reserved in Orders', 'Reservado en Ordenes'],
        'Wallet Management' : ['Wallet Management', 'Manejo de Billetera'],
        'Currency' : ['Currency', 'Moneda'],
        'Awaiting Deposit' : ['Awating Deposit', 'Esperando Deposito'],
        'sell' : ['sell', 'Vender'],
        'Buying' : ['Buying', 'Comprando'],
        'Selling' : ['Selling', 'Vendiendo'],
        'Help' : ['Help', 'Ayuda'],
        'Wallet' : ['Wallet', 'Billetera'],
        'Exchange' : ['Exchange', 'Intercambiar'],
        'Trade' : ['Trade', 'Comerciar'],
        'Support' : ['Support', 'Soporte'],
        'Fees' : ['Fees', 'Tasas'],
        'Login' : ['Login', 'Inicio de Sesion'],
        'Your active orders' : ['Your active orders', 'Ordenes Activas'],
        'Your history' : ['Your history', 'Historial'],
        'Trade history' : ['Trade history', 'Historial de Intercambios'],
        'Forgot your password?' : ['Forgot your password?', 'Olvide mi Contraseña'],
        'New to Enmanet?' : ['New to Enmanet?', 'Nuevo en Enmanet?'],
        'Sign up now!' : ['Sign up now!', 'Registrate Ahora!'],
        'Enmanet - Open Source Cryptocurrency Exchange' : ['Enmanet - Open Source Cryptocurrency Exchange', 'Enmanet - Casa de Cambio de Cryptodivisas']
    }
};
