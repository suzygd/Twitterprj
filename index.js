'use strict'

const express = require('express')
/* on fait appel à express
*/
const app = express()
/* app = le serveur
*/

const port = env.port
/* le serveur local définit dans env.js c a d 3000 , pour info n'importe quel numero de port est valide mais il faut etre au dessus de 256 si tu n'es pas admin de ta machine
*/

const twitter = require('./twitter-client')
/* on fait appel au fichier twitter-client 
*/


/*
 * GET /
 * Serve front page
 */
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
	/* "Quand on appelle la racine ( = /, donc http://localhost:3000/, note le / de fin), répond ( = res) avec le contenu du fichier index.html
	*cad ça envoi vers la page html que je lui indique à savoir le fichier index.html du prj
	*app.get ('/...') = on déclare une nouvelle route
	*/
})

/*
 * GET /tweets
 * REST endpoint to get tweets
 * @param {String} q paris
 * @param {String} latlon 48.8669576,2.3116284,5km
 */
app.get('/tweets', (req, res) => {
/* donc la tu dis maintenant quand tu vas sur http://localhost:3000/tweets, execute la fonction entre { }
*/
	if (req.query.q !== null && req.query.latlon !== null && req.query.q !== '' && req.query.latlon !== '') {
		twitter.get('search/tweets', {
			/* "va chercher les tweets"
			*/
				q: req.query.q,
				geocode: req.query.latlon,
			/* https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets.html#parameters
			*/
				count: 100
			})
			.then(function (tweets) {
				// Filter Twitter API results with only tweets with geo field
				let filteredTweets = tweets.statuses.filter(o => o.geo !== null)

				res.send(filteredTweets)
			})
			.catch(function (error) {
				res.status(500).send(error)
			})
	} else {
		res.sendStatus(400)
	}
})

app.listen(port, (err) => {
	if (err) {
		return console.log('Error', err)
	}
})
