particleJS();
makeFloatOnParticle("authContainer");

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            return true;
        },
        uiShown: function() {
            $("#loader").hide();
        }
    },
    'credentialHelper': firebaseui.auth.CredentialHelper.NONE,
    signInFlow: 'popup',
    signInSuccessUrl: 'app/index.html',
    signInOptions: [{
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    }],
    //tosUrl: 'About/tnc.html',
    //privacyPolicyUrl: 'About/Privacy_Policy.html',
};
ui.start('#authContainer', uiConfig);

if (ui.isPendingRedirect()) {
    ui.start('#authContainer', uiConfig);
}
// This can also be done via:
if ((firebase.auth().isSignInWithEmailLink(window.location.href))) {
    ui.start('#authContainer', uiConfig);
}

firebase.auth().onAuthStateChanged(user => {
    if (user) { window.location.href = "app/index.html"; }
});