// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	Parse = require('parse'),
	ReactDOM = require('react-dom')


console.log('hello')

// ==================================================
// =====PARSE INITIALIZE=============================
// ==================================================
// ==================================================

window.P = Parse

var APP_ID = 'SU8TpFl5xTFmygyvC7Bg9kSLwqy3VYDdtblWDorM',
	JS_KEY = 'xVvq73JOE4npLNA7tmMr4wV5ZFTogWHVTPEmQfBi',
	REST_API_KEY = 'YE9BAeO9eiJl625VSgQskaTUPanzN2g5smxkxtht'

Parse.initialize(APP_ID,JS_KEY)

// ==================================================
// =====MODELS=======================================
// ==================================================
// ==================================================

var PostModel = Backbone.Model.extend({
	url: "https://api.parse.com/1/classes/NewPost",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	}
})

var WikiModel = Backbone.Model.extend({

	parse: function(responseData){
		return responseData.query
	}

})

// https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=Houston&redirects=true

// ==================================================
// =====COLLECTIONS==================================
// ==================================================
// ==================================================

var PostCollection = Backbone.Collection.extend({
	url: "https://api.parse.com/1/classes/NewPost",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	},

	model: PostModel,

	parse: function(responseData){
		console.log(responseData.results)
		return responseData.results
	}
})

// ==================================================
// =====VIEWS========================================
// ==================================================
// ==================================================



// ===== VIEW: Signup/Login ====

var LoginView = React.createClass({

	render: function(){
		return(
			<LoginBox sendUserInfo={this.props.sendUserInfo} />
			)
	}
})

var LoginBox = React.createClass({

	_getLoginParamsClick: function(){
		var password = this.refs.passwordInput.getDOMNode().value
		var username = this.refs.usernameInput.getDOMNode().value
		this.props.sendUserInfo(username,password)		
	},

	_getLoginParams: function(event){
		if(event.which === 13){
			var password = event.target.value
			var username = this.refs.usernameInput.getDOMNode().value
			this.props.sendUserInfo(username,password)
		}
	},

	render: function(){

		return(
			<div id='loginBox'>
				<input type='text' placeholder='Username' ref='usernameInput' autofocus></input>
				<input type='text' placeholder='Password' ref='passwordInput' onKeyPress={this._getLoginParams}></input>
				<button onClick={this._getLoginParamsClick}>SIGN UP</button>
				<div id='alreadyMember'>
					<p>Already a member?</p>
					<p>Signup</p>
				</div>
			</div>
		)
	}
})

// ===== VIEW: Nav ====

var NavView = React.createClass({

	_goLogout: function(){
			location.hash = 'logout'
	},

	_goPost: function(){
		location.hash = 'post'
	},

	_goTest: function(){
		location.hash = 'test'
	},

	_goHome: function(){
		location.hash = 'home'
	},

	render: function(){

		return(
			<div id='navBar'>
				<p id='articleFeed' onClick={this._goHome}>Article Feed</p>
				<p id='bookmarks'>Bookmarks</p>
				<input id='searchBar' type='text' placeholder='Search'></input>
				<p id='test' onClick={this._goTest}>Test</p>
				<p id='post' onClick={this._goPost}>Post</p>
				<p id='menuIcon'>Menu</p>
				<p id='logout' onClick={this._goLogout}>Logout</p>				
			</div>
			)
	}
})

// ===== VIEW: Home ====

var HomeView = React.createClass({

	render: function(){

		return(
			<p>Home</p>
			)
	}

})

// ===== VIEW: Bookmarks ====

var BookmarksView = React.createClass({

	render: function(){

		return(
			<p>These are my bookmarks</p>
			)
	}
})

// ===== VIEW: Post article ====

var PostView = React.createClass({

	render: function(){
		return(
			<PostForm id='PostForm' />
			)
	}

})

var PostForm = React.createClass({
	
	_submitPostClick: function(){
		console.log('Clicked!')
		var postTitle = this.refs.postTitle.getDOMNode().value
		var postArticle = this.refs.postArticle.getDOMNode().value
		var postImage = this.refs.postImage.getDOMNode().value

		var NewPost = Parse.Object.extend({
			className: 'NewPost'
		})

		var newPost = new NewPost()

		newPost.save({
			postTitle: postTitle,
			postArticle: postArticle,
			// postImage: postImage
		}).then(
			function(){
				alert('Published!')
			}
		)
	},

	render: function(){
		return(
			<div id='postForm'>

				<textarea rows='2' id='postTitle' placeholder='Title' ref='postTitle'></textarea>
				<textarea rows = '10' id='postArticle' placeholder='Write here...' ref='postArticle'></textarea>
				<input type='file' id='postImage' placeholder='Add article image' ref='postImage'></input>
				<button id='postSubmit' onClick={this._submitPostClick}>Publish</button>

			</div>
			)
	}
})

// ===== VIEW: Test ====

var Test = React.createClass({

	_scrubWikiLink: function(input){
		var cleanInput = input.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		var cleanInput = cleanInput.replace('?', "")
		var cleanInput = cleanInput.replace(" ","%20")
		return cleanInput
	},

	_getWikiLink: function(event){
		var $el = $(event.target);
   	 	if ($el.is('#nreWord')) {
	   	 	var nreText = $el[0].innerText
	        console.log(nreText);
	        var cleanNreText = this._scrubWikiLink(nreText)
	        location.hash = 'wiki/' + cleanNreText
    	}
	},

	_scanNRE: function(input){
		var newText = input
		var spotObjArray = nlp.spot(newText)
		var spotTextArray = spotObjArray.map(function(el){
			return el.text
		})

		spotTextArray.forEach(function(el){
			var re = new RegExp(el,'g')
			newText = newText.replace(re,"<a id='nreWord'>" + el + "</a>")			
			// above, used id for 'nreWord' instead of class because the is() selector in _getWikiLink is picky and doesn't like use of className
		})
		return newText
	
	},

	render: function(){
		console.log(this.props.testArticles)
		var originalArticle = this.props.testArticles.models[0].attributes.postArticle
		var nreText = this._scanNRE(originalArticle)
		return(
			<div>
				<p>Here are my posts, checkout the NRE's:</p>
				<h2>{this.props.testArticles.models[0].attributes.postTitle}</h2>
				<p onClick={this._getWikiLink} dangerouslySetInnerHTML={{__html: this._scanNRE(originalArticle)}} >
				</p>
			</div>
			)
	}
})

// ===== VIEW: Wiki Article ====

var WikiText = React.createClass({

	render: function(){
		console.log('wikiText')
		var wikiObjectKeys = []
		console.log(this)
		var wikiObject = this.props.wikiText.attributes.pages
		
		for (var key in wikiObject) wikiObjectKeys.push(key)
		console.log('Here are the keys')
		console.log(wikiObjectKeys)
		//In order to access the wiki article text, the json response requires that you know the page id. The page id is a key within the 'pages' object, which I'm calling wikiObject. So I create an array of the keys in this object (which I know only has one key, the page id) in order to find the page id. 
		var pageId = wikiObjectKeys[0]
		var wikiArticleText = wikiObject[pageId].extract

		return(
			<div>
				<p>hi</p>
				<p>{wikiArticleText}</p>
			</div>
			)
	}
})

// ==================================================
// =====ROUTING======================================
// ==================================================
// ==================================================
// 


var WikiRouter = Backbone.Router.extend({


//--Router list----------------------------

	routes: {
		'login':'goLoginView',
		'home': 'goHomeView',
		'post': 'goPostView',
		'logout': 'goLogoutView',
		'test': 'goTestView',
		'wiki/:cleanNreText': 'goWikiView'
	},

//--Login page:----------------------------
//--Signing in / creating user-------------

	processUserInfo: function(username,password){
		console.log('Processing login. Here are the params:')
		console.log(username + ', ' + password)

		var newUser = new Parse.User()
		newUser.set('username',username)
		newUser.set('password',password)
		newUser.signUp()
			.then(
				//success 
				function(usr){
					console.log(username + ' signed up!')
					console.log(usr)
					location.hash = "home"
					console.log(Parse.User.current())
			})
			.fail(
				//fail
				function(err){
					return newUser.logIn()
					}
			)
			.then(
				// success
				function(){
					console.log(username + ' logged in!')
					location.hash = "home"
				},
				// fail
				function(){
					alert('Login not valid')
				}
			)
	},

	goLoginView: function(){
		ReactDOM.render(<LoginView sendUserInfo={this.processUserInfo} />,document.querySelector('#containerB'))
	},

//--Home page:----------------------------

	goHomeView: function(){
		ReactDOM.render(<NavView />,document.querySelector('#containerA'))
		ReactDOM.render(<HomeView />,document.querySelector('#containerB'))
	},


//--Post page:----------------------------

	goPostView: function(){
		ReactDOM.render(<PostView />,document.querySelector('#containerB'))
	},

//--Logout page:---------------------------------

	goLogoutView: function(){
		console.log('this was the user:')
		console.log(Parse.User.current())
		Parse.User.logOut()
		console.log('and now he is logged out')
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerA'))
		this.goLoginView()
	},

//--Test page:----------------------------

	goTestView: function(){
		var self = this
		this.pc.fetch({
			headers: this.pc.parseHeaders
		}).done(function(results){
			console.log(results)
			ReactDOM.render(<Test testArticles={self.pc} />, document.querySelector('#containerB'))
		})
	},

//--Wiki sidebar:----------------------------

	goWikiView: function(cleanNreText){
		var self = this
		this.wm.fetch({
			url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=' +cleanNreText +'&redirects=true&format=json&callback=?',
			headers: { 'Access-Control-Allow-Origin': 'localhost:3000' },
			dataType: 'json',
			processData: true
		}).then(function(results){
			console.log(results)
			ReactDOM.render(<WikiText wikiText={self.wm} />, document.querySelector('#containerB'))
		})

	},


//--Initialize---------------------------------
	
	initialize: function(){
		var self = this
		this.pc = new PostCollection()
		this.pm = new PostModel()
		this.wm = new WikiModel()
		location.hash = 'login'
		Backbone.history.start()
//-----------------------------------

	}

})

var wr = new WikiRouter()

