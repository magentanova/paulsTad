//--Image sidebar:----------------------------

	goImageView: function(gettySearchTerm){
		var self = this
		this.gm.fetch({
			url: 'https://api.gettyimages.com/v3/search/images?embed_content_only=true&fields=id,title,thumb,referral_destinations&sort_order=best&phrase='+gettySearchTerm,
			headers: {
				'Api-Key': gettyApiKey,
				'ImageFamily': 'Editorial'
			},
			dataType: 'json',
			processData: true
		}).then(function(results){
			console.log(results)
			ReactDOM.render(<GettyWindow imageArray={results.images} />, document.querySelector('#containerC'))

		})
	},


//--Image sidebar:----------------------------


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

	render: function(){
		console.log(this)
		var imageArray = this.props.imageArray
		var wikiSearchTerm = location.hash.slice(8)

		return(
			<div id='wikiArticleText' className='animated fadeIn'>
				<div id='wikiBoxHeader'>
					<div id='closeX' >
						<img id='blueX' src='./images/blueX.png' onClick={this._closeWikiBox}></img>
						<p id='wikiIcon' style={{color:'#C8C9CB'}} onClick={function(){location.hash='wiki/'+wikiSearchTerm}}>Wikipedia</p>
						<p id='gettyIcon' style={{color:'black'}} >Images</p>
					</div>
				</div>
				<div id='gettyImageList'>
					{imageArray.map(this._displayImages)}
				</div>
			</div>
			)
	}
})