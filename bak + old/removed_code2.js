function onFailure(error) {
     console.log(error);
};

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
};

function renderButton() { // How is this being called without it being called in the disabled script above?
   gapi.signin2.render('g-signin2', {
		'scope': 'profile email',
      'width': 150,
      'height': 45,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSignIn,
      'onfailure': onFailure
   });
};