// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	Parse = require('parse'),
	ReactDOM = require('react-dom')

var P = window.Parse

console.log('hello')


// RELATIVE TIME

function relativeTime(date_str) {
	    if (!date_str) {return;}
	    date_str = $.trim(date_str);
	    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
	    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
	    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
	    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
	    var parsed_date = new Date(date_str);
	    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
	    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
	    delta=(delta<2)?2:delta;
	    var r = '';
	    if (delta < 60) {
	    r = delta + ' seconds ago';
	    } else if(delta < 120) {
	    r = 'a minute ago';
	    } else if(delta < (45*60)) {
	    r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
	    } else if(delta < (2*60*60)) {
	    r = 'an hour ago';
	    } else if(delta < (24*60*60)) {
	    r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
	    } else if(delta < (48*60*60)) {
	    r = 'a day ago';
	    } else {
	    r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
	    }
	    return r;
	};

// ==================================================
// =====UNMOUNTING E=================================
// ==================================================
// ==================================================

var unmountContainerE = function(){
		console.log('im unmounting')
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerE'))
}


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
// =====GETTY IMAGES API=============================
// ==================================================
// ==================================================

var gettyApiKey = 'khexpaeqvskvstpetvgtss4t'
var gettySecret = 'v228etYpy3uvYUJCBWBsWkRU4JEk4BmX25X65DCFhMfgq'

// ==================================================
// =====MODELS=======================================
// ==================================================
// ==================================================

var PostModel = Backbone.Model.extend({
	url: "https://api.parse.com/1/classes/NewPost",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	},

	parse: function(responseData){
		return responseData
	}
})

var WikiModel = Backbone.Model.extend({

	parse: function(responseData){
		return responseData.query
	}

})

var GettyModel = Backbone.Model.extend({

	parse: function(responseData){
		return responseData
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

var WikiCollection = Backbone.Collection.extend({

	url: "https://api.parse.com/1/classes/NewPost",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	},

	model: PostModel,

	parse: function(responseData){
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
				<input type='text' id='loginUsername' placeholder='Username' ref='usernameInput' autofocus></input>
				<input type='password' id='loginPassword' placeholder='Password' ref='passwordInput' onKeyPress={this._getLoginParams}></input>
				<button id='signUpButton' onClick={this._getLoginParamsClick}>SIGN UP</button>
				<div id='alreadyMember'>
					<p>Already a member? <span id='loginButton'>Login</span></p>					
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

	_goHome: function(){
		location.hash = 'home'
	},

	_goSearchView: function(){

	},

	_goBookmarks: function(){
		location.hash = 'bookmarks'
	},

	_goBookmarkPreview: function(){
		console.log('im hovering')
		$('#currentArticles').css('-webkit-filter','blur(3px)')
		$('#featuredArticles').css('-webkit-filter','blur(3px)')
		$('#articleBox').css('-webkit-filter','blur(3px)')
		$('#wikiArticleText').css('-webkit-filter','blur(3px)')	

		ReactDOM.render(<BookmarkPreview  />,document.querySelector('#containerE'))
	},

	render: function(){

		return(
			<div id='navBar'>
				<p id='articleFeed' onClick={this._goHome}>Article Feed</p>
				<p id='bookmarks' onMouseOver={this._goBookmarkPreview}onClick={this._goBookmarks}>Bookmarks</p>
				<p id='post' onClick={this._goPost}>Post</p>
				<p id='logout' onClick={this._goLogout}>Logout</p>
				<i id='searchIcon' className="pe-7s-search"></i>			
				<i className="pe-7s-menu"></i>
			</div>
			)
	}
})

// ===== VIEW: Bookmark Preview ====

var BookmarkPreview = React.createClass({

	_closeBookmarkPreview: function(){
		$('#currentArticles').css('-webkit-filter','blur(0px)')
		$('#featuredArticles').css('-webkit-filter','blur(0px)')
		$('#articleBox').css('-webkit-filter','blur(0px)')
		$('#wikiArticleText').css('-webkit-filter','blur(0px)')	
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerE'))
	},

	render: function(){
		return(
			<div id='bookmarkPreview' className='animated fadeIn' onMouseLeave={this._closeBookmarkPreview}>
				<p id='bookmarksTitle'>My<br></br>Bookmarks</p>
			</div>
			)
	}

})


// ===== VIEW: Home ====

var HomeView = React.createClass({

	_displayArticles: function(articleObject){
		return (
			<div id='homeArticleBox'>
				<img data-id={articleObject.attributes.objectId} id='homeArticleImage' src={articleObject.attributes.postImage.url} onClick={this._singleArticleClick}/>
				<p data-id={articleObject.attributes.objectId} id='homeArticleTitle' onClick={this._singleArticleClick}>{articleObject.attributes.postTitle}</p>
				<p id='homeArticleAuthor'>By AUTHOR</p>
				<p className='timeago' id='homeArticleDate'>Posted {relativeTime(articleObject.attributes.createdAt)} </p>

			</div>
			)
	},

	_singleArticleClick: function(event){
		var articleClicked = event.target
		console.log(articleClicked)
		var articleObjectId = articleClicked.dataset.id
		console.log(articleObjectId)
		location.hash = "article/" + articleObjectId
		// now add routing so that this hash directs to single article view (adaptation of test)
	},

	render: function(){
		console.log('heres HomeView')
		console.log(this)

		var articleArray = this.props.currentArticles.models

		return(
			<div>
				<div id='featuredArticles'>
					<p>Featured<br />Articles</p>
					<p id='goHere'>Will go here</p>
				</div>
				<div id='currentArticles'>
				{articleArray.map(this._displayArticles)} 
				</div>
			</div>
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
		var postImage = $('#postImage')[0].files[0]
		
		var PostHeaderImage = new Parse.File('postHeaderImage.jpg',postImage)


		console.log(PostHeaderImage)

		PostHeaderImage.save().then(function(){

			alert('saved!')

		var NewPost = Parse.Object.extend({
			className: 'NewPost'
		})

		var newPost = new NewPost()

		newPost.save({
			postTitle: postTitle,
			postArticle: postArticle,
			postImage: PostHeaderImage

		})}).then(
			function(){
				alert('Published!')
			}
		)
	},

	_addFootnote: function(event){
	    var sel, range;
		var newFootnote = this.refs.newFootnote.getDOMNode().value

	    if (window.getSelection) {
	        sel = window.getSelection();
	        var activeElement = document.activeElement;
	        if (activeElement.nodeName == "TEXTAREA" ||
	           (activeElement.nodeName == "INPUT" && activeElement.type.toLowerCase() == "text")) {
	               var val = activeElement.value, 
	           		   start = activeElement.selectionStart, 
	           		   end = activeElement.selectionEnd;
	               activeElement.value = val.slice(0, start) + "<span id='footnote' data-txt='" + newFootnote +"'>" + sel + "</span>" + val.slice(end);	
	               document.execCommand("CreateLink", false, "http://stackoverflow.com/");
               
	        } 
	    }

	},

	

	render: function(){
		return(
			
			<div id='overallPost'>				

				<div id='postForm'>

					<textarea rows='2' id='postTitle' placeholder='Title' ref='postTitle'></textarea>
					<textarea rows = '10' id='postArticle' placeholder='Write here...' ref='postArticle'></textarea>	
					<input type='file' id='postImage' placeholder='Add article image' ref='postImage'></input>
					<button id='postSubmit' onClick={this._submitPostClick}>PUBLISH</button>

				</div>
				
			</div>
			)
	}
})

// ===== VIEW: Single Article ====

var SingleArticleView = React.createClass({

	_scrubWikiLink: function(input){
		var cleanInput = input.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		var cleanInput = cleanInput.replace('?', "")
		var cleanInput = cleanInput.replace(" ","%20")
		return cleanInput
	},

	_getWikiLink: function(event){
		console.log('clicked!')
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

	_addBookmark: function(){
		console.log('adding bookmark')
		console.log(this)
		// ADD CODE HERE THAT IDENTIFIES ARTICLE TITLE, TEXT & OTHER INFO AND SAVES IT TO PARSE
	},
		
	render: function(){

		var originalArticle = this.props.article.postArticle
		var nreText = this._scanNRE(originalArticle)
		
		return(
			<div id='articleBox'>
				<div id='articleHeader'>
					<h2>{this.props.article.postTitle}</h2>
					<p id='articleInfo'>By Author, {relativeTime(this.props.article.createdAt)}</p>					
				</div>

				<img id='articleHeaderImage' src={this.props.article.postImage.url}></img>
				<p id='articleText' onClick={this._getWikiLink} dangerouslySetInnerHTML={{__html: this._scanNRE(originalArticle)}} >
				</p>
				<div id='bookmarkDiv'>
					<p>+ Bookmark</p>
				</div>
				<div id='articleFooter'>
				</div>
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
		console.log('clicked!')
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

	_addBookmark: function(){
		console.log('adding bookmark')
		console.log(this)
		// ADD CODE HERE THAT IDENTIFIES ARTICLE TITLE, TEXT & OTHER INFO AND SAVES IT TO PARSE
	},

	render: function(){
		console.log(this.props.testArticles)
		var originalArticle = this.props.testArticles.models[21].attributes.postArticle
		var nreText = this._scanNRE(originalArticle)
		return(
			<div id='articleText'>
				<h2>{this.props.testArticles.models[21].attributes.postTitle}</h2>
				<img id='articleHeaderImage' src={this.props.testArticles.models[21].attributes.postImage.url}></img>
				<p onClick={this._getWikiLink} dangerouslySetInnerHTML={{__html: this._scanNRE(originalArticle)}} >
				</p>
				<i id='bookmarkButton' className="material-icons" onClick={this._addBookmark}>bookmark_border</i>
			</div>
			)
	}
})

// ===== VIEW: Wiki Article ====

var WikiText = React.createClass({

	_closeWikiBox: function(event){
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerC'))
	},

	_goImages: function(){
		var wikiSearchTerm;
		$('#gettyIcon').css('color','black')
		location.hash = 'images/'+ wikiSearchTerm
	},

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
		var wikiSearchTerm = wikiObject[pageId].title

		return(
			<div id='wikiArticleText' className='animated fadeIn'>
				<div id='wikiBoxHeader'>
					<div id='closeX' >
						<img id='blueX' src='./images/blueX.png' onClick={this._closeWikiBox}></img>
						<p id='wikiIcon'>Wikipedia</p>
						<p id='gettyIcon' onClick={function(){location.hash='images/'+wikiSearchTerm}}>Images</p>
					</div>
				</div>
				<div id='actualArticleText'>
					<p dangerouslySetInnerHTML={{__html: wikiArticleText}}></p>
				</div>
			</div>
			)
	}
})

var GettyWindow = React.createClass({

	_closeWikiBox: function(event){
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerC'))
	},

	_displayImages: function(element){
		var returnValue = '<img src=' + element.display_sizes[0].uri + '/>'
		var gettyLink = element.referral_destinations[0].uri
		console.log(returnValue)
		return (
			<div id='gettyResult'>
				<a href={gettyLink} target="_blank"><img id='gettyImageSingle' src={element.display_sizes[0].uri} /></a>
			</div>
			)						
		
	},

	_displayGoogleImages: function(element){
		var returnValue = '<img src=' + element.unescapedUrl + '/>'
		return(
			<div id='gettyResult'>
				<a href={element.originalContextUrl}><img id='gettyImageSingle' src={element.unescapedUrl} /></a>
			</div>
			)
	},

	render: function(){
		console.log(this)
		var imageArray = this.props.imageArray
		var wikiSearchTerm = location.hash.slice(8)

		// return(
		// 	<div id='wikiArticleText' className='animated fadeIn'>
		// 		<div id='wikiBoxHeader'>
		// 			<div id='closeX' >
		// 				<img id='blueX' src='./images/blueX.png' onClick={this._closeWikiBox}></img>
		// 				<p id='wikiIcon' style={{color:'#C8C9CB'}} onClick={function(){location.hash='wiki/'+wikiSearchTerm}}>Wikipedia</p>
		// 				<p id='gettyIcon' style={{color:'black'}} >Images</p>
		// 			</div>
		// 		</div>
		// 		<div id='gettyImageList'>
		// 			{imageArray.map(this._displayImages)}
		// 		</div>
		// 	</div>
		// 	)
		// 	
		return(
			<div id='wikiArticleText' className='animated fadeIn'>
				<div id='wikiBoxHeader'>
					<div id='closeX' >
						<img id='blueX' src='./images/blueX.png' onClick={this._closeWikiBox}></img>
						<p id='wikiIcon' style={{color:'#C8C9CB'}} onClick={function(){location.hash='wiki/'+wikiSearchTerm}}>Wikipedia</p>
						<p id='gettyIcon' style={{color:'black'}} >Images</p>
					</div>
				</div>
				<div id='googleImageList'>
					{imageArray.map(this._displayGoogleImages)}
				</div>
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
		'wiki/:cleanNreText': 'goWikiView',
		'article/:articleObjectId': 'goSingleArticleView',
		'images/:gettySearchTerm': 'goImageView'
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
					$('html').css('background','none')
					$('html').css('background-color','#ffffff')
					location.hash = "home"
				},
				// fail
				function(){
					alert('Login not valid')
				}
			)
	},

	goLoginView: function(){
		ReactDOM.render(<LoginView sendUserInfo={this.processUserInfo} />,document.querySelector('#containerD'))
	},

//--Home page:----------------------------

	goHomeView: function(){
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerB'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerC'))
		ReactDOM.render(<NavView />,document.querySelector('#containerA'))

		var self = this
		this.wc.fetch({
			headers: this.wc.parseHeaders
		}).done(function(){
			React.render(<HomeView currentArticles = {self.wc} />, document.querySelector('#containerD')) 
		})
	},


//--Post page:----------------------------

	goPostView: function(){
		ReactDOM.render(<PostView />,document.querySelector('#containerD'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerB'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerC'))
	},

//--Logout page:---------------------------------

	goLogoutView: function(){
		console.log('this was the user:')
		console.log(Parse.User.current())
		Parse.User.logOut()
		console.log('and now he is logged out')
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerA'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerB'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerC'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerD'))
		ReactDOM.unmountComponentAtNode(document.querySelector('#containerE'))
		this.goLoginView()
	},

//--Test page:----------------------------

	goTestView: function(){
		var self = this
		this.pc.fetch({
			headers: this.pc.parseHeaders
		}).done(function(results){
			console.log(results)
			ReactDOM.render(<Test testArticles={self.pc} />, document.querySelector('#containerB')).done(function(){ReactDOM.unmountComponentAtNode(document.querySelector('#containerD'))})
		})
	},

//--Single article view:----------------------------
	goSingleArticleView: function(articleObjectId){
		console.log('running single article view in router')
		console.log(articleObjectId)
		var self = this
		this.pm.fetch({
			headers: this.pm.parseHeaders,
			query: articleObjectId
		}).then(function(results){
			var articleObjArray = results.results
			console.log(articleObjArray)
			articleObjArray.forEach(function(obj){
				if(obj['objectId']===articleObjectId){
					console.log('found article')
					console.log(obj)
					var articleClicked = obj
					ReactDOM.render(<SingleArticleView article={articleClicked} />, document.querySelector('#containerB'))
					ReactDOM.unmountComponentAtNode(document.querySelector('#containerD'))
				}
				
			})
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
			ReactDOM.unmountComponentAtNode(document.querySelector('#containerC'))
			ReactDOM.render(<WikiText wikiText={self.wm} />, document.querySelector('#containerC'))
		})

	},

//--Image sidebar:----------------------------

	goImageView: function(gettySearchTerm){
		var self = this
		this.gm.fetch({
			// url: 'https://api.gettyimages.com/v3/search/images?embed_content_only=true&fields=id,title,thumb,referral_destinations&sort_order=best&phrase='+gettySearchTerm,
			// headers: {
			// 	'Api-Key': gettyApiKey,
			// 	'ImageFamily': 'Editorial'
			// },
			// dataType: 'json',
			// processData: true
			url: 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + gettySearchTerm,
			dataType: 'jsonp',
			processData: true
		}).then(function(results){
			console.log(results)
			ReactDOM.render(<GettyWindow imageArray={results.responseData.results} />, document.querySelector('#containerC'))

		})
	},

//--Initialize---------------------------------
	
	initialize: function(){
		var self = this
		this.pc = new PostCollection()
		this.pm = new PostModel()
		this.wm = new WikiModel()
		this.wc = new WikiCollection()
		this.gm = new GettyModel()
		location.hash = 'login'
		Backbone.history.start()
//-----------------------------------

	}

})

var wr = new WikiRouter()

