Notes I thought might help those helping me:

Sorry if there's code in here that makes it hard to run on your machine, if you're trying to actually get it to run (I just figured maybe you could see right away what the problem is/was).  I'm working on a version that doesn't use the database or any files, so sharing is easier.

All Files in the /views DIRECTORY should be the same in both versions.

Only the index.js files should differ (at least in what they do):

Attempt #1:	 
After visiting /login, the rendered view file sends an XHR request to /loggedin, which then tries to verify the token and return the next() function and render node-dopple-login-success, but fails.

Attempt #2:
After visiting /login, the rendered view file sends an XHR request to /loggedin, which then tries to verify the token and render node-dopple-login-success, but fails.

Attempt #3:
This is the most successful attempt, but after verifying the token, it still doesn't render the login page.  No idea.

Attempt #4: I forget, but probably just a less buggy version of #3.

Attempt #5: The first one to actually work, but it still only logs the user in and doesn't keep them logged in through/after page reloads/changes.

Attempt #6: The first one to actually work semi-properly.  It uses an initial XHR request to an express enpoint which then perform initial verification.  On success, that XHR request redirects to another page which passes in the just-verified token as data, which then renders the page (and sets a cookie, containing the ID token) if it's verified again.  Another route (/private2) checks the userID in the cookie and renders a page if it's successfully verified.  What's missing/next?  The expiration date on the cookie needs to be checked, and if it's past the time, it should be rejected.

Attempt #7: The first one to work almost fully.  Uses cookies, but doesn't verify expiration date yet on token.

Attempt #8: Expired tokens will now be rejected (at least on the first route I did it on).  Now I must make it re-verify and set cookie once one expires.

Attempt #9: Expired tokens will now be rejected.  Lines will be added to refresh the token after it expires, somehow.  Add /refreshToken node?

Attempt #10: Cleaned-up version of #9. Also, there may be some things I'm missing or not doing correctly, but at this point I believe everything is pretty much working fully and there's nothing more I can do (in terms of security), but I will continue to see if this is the case.

Attempt #11: Uses cookies to keep user logged in (no?).

Attempt #12: First version to attempt to send data in HTTP header.

	Notes: 
		https://medium.facilelogin.com/jwt-jws-and-jwe-for-not-so-dummies-b63310d201a3
		
		


https://bugs.chromium.org/p/chromium/issues/detail?id=954323

Solution Not in Google Database:
https://stackoverflow.com/questions/32150845/how-to-refresh-expired-google-sign-in-logins?rq=1
https://pasteboard.co/K30MlPG.png



JUST MAKE A STUPID PASSPORT VERSION LIKE EVERYONE ELSE.  