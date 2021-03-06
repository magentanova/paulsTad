// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	Parse = require('parse'),
	ReactDOM = require('react-dom'),
	nlp = require('nlp_compromise')

var P = window.Parse

console.log('hello')

console.log(nlp)
window.nlp = nlp

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

	componentWillMount: function() {
		document.querySelector('html').style.background = "url(images/Shore.jpg) no-repeat center center fixed"
	},

	componentWillUnmount: function() {
		document.querySelector('html').style.background = "none"		
	},

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
		$('#containerE').css('height','400px')

		var currentUserId = Parse.User.current().id

		var favArray = Parse.User.current().get('userBookmarks')
		console.log('new fav array')
		console.log(favArray)

		var favObjArray = []
		
		var fc = new PostCollection
		fc.fetch({
			headers: fc.parseHeaders
		}).done(function(results){
			console.log(results)
			var resultsArray = results.results
			favArray.forEach(function(articleId){
				resultsArray.forEach(function(articleObj){
					if (articleId === articleObj.objectId){
						console.log('I found a match!')
						var matchTitle = articleObj.postTitle
						var matchImageUrl = articleObj.postImage.url
						var matchId = articleObj.objectId
						console.log(matchTitle, matchImageUrl)
						var favObj = {
							matchTitle: matchTitle,
							matchImageUrl: matchImageUrl,
							matchId: matchId
						}
						favObjArray.push(favObj)
					}					
				})
			})
			console.log('TEST')
			console.log(favObjArray)
			ReactDOM.render(<BookmarkPreview favArticles={favObjArray}  />,document.querySelector('#containerE'))
		})
		
	},

	render: function(){

		return(
			<div id='navBar'>
				<img id='logo' onClick={this._goHome} src='./images/logo5.png' />
				<p id='articleFeed' onClick={this._goHome}>Article Feed</p>
				<p id='bookmarks' onMouseOver={this._goBookmarkPreview}onClick={this._goBookmarks}>Bookmarks</p>
				<p id='post' onClick={this._goPost}>Post</p>
				<p id='logout' onClick={this._goLogout}>Logout</p>
				<img id='searchPng' src='./images/search.png' />			
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
		$('#containerE').css('height','0px')

		ReactDOM.unmountComponentAtNode(document.querySelector('#containerE'))
	},

	_goSingleArticleView: function(event){
		var articleClicked = event.target

	},

	_renderFavorites: function(articleObj){
		var matchImageUrl = articleObj.matchImageUrl
		var matchTitle = articleObj.matchTitle
		var matchId = articleObj.matchId

		return(
			<div id='previewBlock'>
				<img onClick={function(){location.hash='article/'+matchId; ReactDOM.unmountComponentAtNode(document.querySelector('#containerE'))}} src = {matchImageUrl} />
				<p onClick={function(){location.hash='article/'+matchId; ReactDOM.unmountComponentAtNode(document.querySelector('#containerE'))}} id='previewTitle'>{matchTitle}</p>				
			</div>
			)
	},

	render: function(){
		console.log('here is bookmark preview')
		console.log(this)

		var favoritedObjArray = this.props.favArticles
	
		return(
			<div id='bookmarkPreview' className='animated fadeIn' onMouseLeave={this._closeBookmarkPreview}>
				<p id='bookmarksTitle'>My Bookmarks</p>
				<div id='previewOuterBox'>
					<div id='bookmarkedItems'>
						{favoritedObjArray.map(this._renderFavorites)}
					</div>
				</div>
			</div>
			)
	}

})


// ===== VIEW: Home ====

var HomeView = React.createClass({

	_addBookmark: function(event){

		event.target.style.color = '#444'		
					
		var articleClicked = event.target		
		
		var articleId = articleClicked.dataset.id
		var articleIdArray = '['+articleId+']'
		// var articleString = '['+articleId+']'
		var currentUserId = Parse.User.current().id
		console.log(articleId)

		if(Parse.User.current().get('userBookmarks')){
			Parse.User.current().get('userBookmarks').push(articleId)
			
		}

		else{
			Parse.User.current().set('userBookmarks',[])
			Parse.User.current().get('userBookmarks').push(articleId)	
		}

		Parse.User.current().save(null, {
  			success: function(){
  				console.log('saved!')
  			},
 			error: function(){
 				console.log('not saved')
  			}
		})

	},


	_displayArticles: function(articleObject){
		return (
			<div id='homeArticleBox'>
				<img data-id={articleObject.attributes.objectId} id='homeArticleImage' src={articleObject.attributes.postImage.url} onClick={this._singleArticleClick}/>
				<p data-id={articleObject.attributes.objectId} id='homeArticleTitle' onClick={this._singleArticleClick}>{articleObject.attributes.postTitle}</p>
				<div id='homeLeftDiv'>
					<p id='homeArticleAuthor'>By AUTHOR</p>
					<p className='timeago' id='homeArticleDate'>Posted {relativeTime(articleObject.attributes.createdAt)} </p>
				</div>
				<div id='homeRightDiv'>
					<i data-id={articleObject.attributes.objectId} onClick={this._addBookmark} id='homeBookmarkButton' className="material-icons">bookmark_border</i>
				</div>

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
					<div id='featuredBanner'>
						<img src='./images/paris.png' id='paris' />
						<img id='kansas' src='./images/kansas.jpg' />
					</div>

				</div>
				<div id='currentArticles'>
				{articleArray.map(this._displayArticles).reverse()} 
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

			console.log('saved!')

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
				location.hash='home'
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

					<textarea className="animated fadeIn" rows='2' id='postTitle' placeholder='Title' ref='postTitle'></textarea>
					<textarea className="animated fadeIn" style={{'animation-delay':'0.25s'}} rows = '10' id='postArticle' placeholder='Write here...' ref='postArticle'></textarea>
					<div id='imageUpload' className="animated fadeIn" style={{'animation-delay':'0.5s'}}>	
						<p id='uploadLabel'>Article image</p>
						<input type='file' id='postImage' placeholder='Article image' ref='postImage'></input>
					</div>
					<button className="animated fadeIn" style={{'animation-delay':'0.75s'}} id='postSubmit' onClick={this._submitPostClick}>PUBLISH</button>

				</div>
				
			</div>
			)
	}
})

// ===== VIEW: Single Article ====

var SingleArticleView = React.createClass({

	_scrubWikiLink: function(input){
		var cleanInput = input.replace(/[.,-\/#!$%\^&\*;:{}=\-_~()]/g,"")
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
		var spotObjArray = nlp.text(newText).topics()
		var spotTextArray = spotObjArray.map(function(el){
			return el.text
		})

		console.log(spotTextArray)

		spotTextArray.forEach(function(el){
			var re = new RegExp(el,'gi')
			newText = newText.replace(re,'<a id="nreWord">$&</a>')			
			// above, used id for 'nreWord' instead of class because the is() selector in _getWikiLink is picky and doesn't like use of className
		})
		console.log(newText)
		return newText
	},

	_addBookmark: function(){
		console.log('adding bookmark')
		console.log(this)

		var articleId = location.hash.slice(9)
		var articleIdArray = '['+articleId+']'
		// var articleString = '['+articleId+']'
		var currentUserId = Parse.User.current().id
		console.log(articleId)

		if(Parse.User.current().get('userBookmarks')){
			Parse.User.current().get('userBookmarks').push(articleId)
			
		}

		else{
			Parse.User.current().set('userBookmarks',[])
			Parse.User.current().get('userBookmarks').push(articleId)	
		}

		Parse.User.current().save(null, {
  			success: function(){
  				console.log('saved!')
  			},
 			error: function(){
 				console.log('not saved')
  			}
		})

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
				<div id='bookmarkDiv' onClick={this._addBookmark}>
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
		var cleanInput = input.replace(/[.,-\/#!$%\^&\*;:{}=\-_~()]/g,"")
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
		var spotObjArray = nlp.text(newText).topics()
		var spotTextArray = spotObjArray.map(function(el){
			return el.text
		})

		spotTextArray.forEach(function(el){
			var re = new RegExp(el,'gi')
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
						<img id='blueX' src='./images/blueX6.png' onClick={this._closeWikiBox}></img>
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
		// var returnValue = '<img src=' + element.display_sizes[0].uri + '/>'
		// var gettyLink = element.referral_destinations[0].uri
		console.log(element.image.contextLink, element.link)
		return (
			<div id='gettyResult'>
				<a href={element.image.contextLink} target="_blank"><img id='gettyImageSingle' src={element.link} /></a>
			</div>
			)						
		
	},

	_displayGoogleImages: function(element){
		console.log(element.image.contextLink, element.link)
		return (
			<div id='gettyResult'>
				<a href={element.image.contextLink} target="_blank"><img id='gettyImageSingle' src={element.link} /></a>
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
						<img id='blueX' src='./images/blueX6.png' onClick={this._closeWikiBox}></img>
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
		'images/:gettySearchTerm': 'goImageView',
		'*anything': 'goHomeView'
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
			console.log('here we go...')
			console.log(results)

			if(results.query.pages['-1']){
				console.log('YUP')
			}

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
			url: 'https://www.googleapis.com/customsearch/v1',
			data: {
				key: "AIzaSyDr6T8gkhLh6ZhsEX9MjtW9fMYk5ehPaKw",
				cx: "008940921588152958013:h64uer7a344",
				q: gettySearchTerm,
				searchType: "image"
				},
			processData: true
			}).then(function(results){
				console.log(results)
				ReactDOM.render(<GettyWindow imageArray={results.items} />, document.querySelector('#containerC'))
			})
	},

//--Initialize---------------------------------
	
	initialize: function(){
		window.P = Parse
		var self = this
		this.pc = new PostCollection()
		this.pm = new PostModel()
		this.wm = new WikiModel()
		this.wc = new WikiCollection()
		this.gm = new GettyModel()
		if (!Parse.User.current()) {
			location.hash = 'login'
		}
		Backbone.history.start()
//-----------------------------------
	}

})

var wr = new WikiRouter()

