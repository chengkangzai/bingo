const _0x4f80 = ['../index.html', 'global-dominion-257804', 'signOut', 'auth', 'G-ME1C4JNPSN', '47236666965', 'catch', 'then', 'AIzaSyAfqVV60xtpvm6BKhp3y1Zc8hSh9UO5IkI', 'firestore', 'https://global-dominion-257804.firebaseio.com', 'removeItem', 'href', 'userID', 'initializeApp'];
(function(_0x4063a8, _0x4f806e) {
    const _0x11151a = function(_0x1f4396) { while (--_0x1f4396) { _0x4063a8['push'](_0x4063a8['shift']()); } };
    _0x11151a(++_0x4f806e);
}(_0x4f80, 0xf2));
const _0x1115 = function(_0x4063a8, _0x4f806e) { _0x4063a8 = _0x4063a8 - 0x0; let _0x11151a = _0x4f80[_0x4063a8]; return _0x11151a; };
const _0x45e07f = _0x1115,
    firebaseConfig = { 'apiKey': _0x45e07f('0x6'), 'authDomain': 'global-dominion-257804.firebaseapp.com', 'databaseURL': _0x45e07f('0x8'), 'projectId': _0x45e07f('0xe'), 'storageBucket': 'global-dominion-257804.appspot.com', 'messagingSenderId': _0x45e07f('0x3'), 'appId': '1:47236666965:web:1af37f74e46eb9ea2be6dc', 'measurementId': _0x45e07f('0x2') };
firebase[_0x45e07f('0xc')](firebaseConfig);
const db = firebase[_0x45e07f('0x7')]();

function logout() {
    const _0x32ffa3 = _0x45e07f;
    firebase[_0x32ffa3('0x1')]()[_0x32ffa3('0x0')]()[_0x32ffa3('0x5')](() => {
        const _0x5209f7 = _0x32ffa3;
        localStorage[_0x5209f7('0x9')](_0x5209f7('0xb')), window['location'][_0x5209f7('0xa')] = _0x5209f7('0xd');
    })[_0x32ffa3('0x4')](_0x1f4396 => { console['log'](_0x1f4396); });
}