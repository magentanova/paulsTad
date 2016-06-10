// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react')

var sampleText = 'It is hard not to resent Flaubert for making fictional prose stylish—for making style a problem for the first time in fiction. After Flaubert, and in particular after Flaubert letters, style is always mirrored, always self-conscious, always a trapped decision. Style became religious with Flaubert, at the same moment that religion became a kind of literary style, a poetry, with Renan. Flaubert himself admired Rabelais, Cervantes, and Molière as if they were beasts of mere instinct: "they are great… because they have no techniques." Such writers "achieve their effects, regardless of Art," he wrote to his lover Louise Colet in 1853. But Flaubert could not be free as those writers: "One achieves style only by atrocious labour, a fanatic and dedicated stubbornness." He was imprisoned in scruple, and he imprisoned his successors in scruple. He is the novelist from whom the Modern, with all its narrow freedoms, flows. Style had always been a battle for novelists, but Flaubert, in his letters at least, turned it into a perpetual defeat. Indeed, fiction itself was felt as a kind of defeat by Flaubert, it became a vessel defined by what it could not hold. Those letters, now available in a fine new translation by Geoffrey Wall, speak again and again of squeezed hours at his mothers house at Croisset, of how little he has written, of the monstrous difficulty of writing a sentence. It is at first surprising that this new consciousness of limit was born in the apparently limitless heyday of the novel, at the moment when the novel began to have a formal sense of how it should be conducting itself—the moment of European "realism." Flaubert was beholden to realism, but he also detested it. He was torn into two sensibilities, he wrote to Louise Colet: "In me, when it comes to literature, there are two quite-distinct creatures: one who is very taken with being a loudmouth, with lyricism, with soaring like an eagle with all sonorities of phrase and loftinesses of idea; the other who digs and delves into the truth as far as he can, who loves to represent the little detail as powerfully as the other kind, who would like to make you feel almost materially the objects he describes."Yet the romantic was stronger than the realist in Flaubert. His first major literary effort was the wildly lyrical The Temptation of St. Antony, a book that he partially abandoned in 1849 after reading it aloud (over four days) to his friends Maxime Du Camp and Louis Bouilhet. They told him, in effect, that it was a lush failure, that he must thin his wardrobe of luxuries, and discipline his style, and choose a nice bourgeois subject. He chose Emma Bovary provincial adulteries. (Madame Bovary appeared in 1857.) But he returned again and again to his beloved Temptation, eventually publishing it in 1874. In this curious failure. St. Antony is tempted by sumptuous sensuality (the Queen of Sheba in flowing robes), by visions of power offered by the Devil, and by heresy. The book, which is written out in the form of a play, is silkily, weightlessly fantastical. Yet Flauberts letters reveal that this book was the marriage of his life, and the others were merely affairs. It is too simple to say that Flaubert romanticized realism. Still, his obsession with the sentence represents an attempt to turn prose into lines of consecutive verse, "to impart to prose the rhythm of verse (leaving it still prose and very prosey)," as he put it in 1853. Certainly, Flaubert self-consciousness in this regard represents the collision of realism and romanticism, of the ordinary and the exotic, rather as strange forms of etiquette emerge when an old epoch falls into economic distress. The novel was triumphant at the middle of the century, and there is a sense in which Melville, Flaubert, and Gogol, all of them wilting roughly contemporaneously, were poets who wanted to make the novel a genre that could consume all others and then perform all their functions at once—a stomach of genres, digesting satire, poetry, epic, the historical novel, realism, and fable. (Moby-Dick, Dead Souls, and Madame Bovary are all prose-poems of a kind, and were all called this on publication.) Flaubert was forever restless, telling his correspondents that he would write a fairy-tale, or a fantasy, or an historical epic, or his celebrated dictionary of stupidities; his gargantuan reading seems an ingestive response to this borderless hunger. Under Flaubert, however, the novel great expansion was perhaps an expansion into limit. Flaubert was marched by his army of ambitions into a war of literary possibilities, only to be overwhelmed by sheer option. The novel discovered all that it could do, all that it then had to do, and it collapsed out of fatigue into style, into the one thing any writer must do—not immediately, of course, not for a century, not perhaps until the nouveau roman, whose leading representative, Nathalie Sarraute, rightly asked in 1965: "How can it be doubted that Flaubert is the precursor?" Alain Robbe-Grillet, in his manifesto For A New Novel (1963), used Balzacian realism as his enemy, and pronounced Flaubert as the writer who changed the old order: "But then, with Flaubert, everything begins to vacillate. A hundred years later, the whole system is no more than a memory." For Robbe-Grillet, an evolution from Flaubert could be plotted along these lines (though Robbe-Grillet list is rather meaningless): "Flaubert, Dostoevski, Proust, Kafka, Joyce, Faulkner, Beckett… Far from making a tabula rasa of the past, we have most readily reached an agreement on the names of our predecessors; and our ambition is merely to continue them." When the nineteenth-century novel became madly ambitious to be everything, it began to chastise itself for failing to do everything. Taking everything as its only measure, it became afflicted with a sense of its failure, and began to throw off those ambitions, like a plane dumping fuel, until only one was left: its very essence, style itself. Until Flaubert, the novel had been mithridated in its own unself-consciousness, as an alcoholic thoughtlessly medicates himself; but Flaubert took away its sweet, ignorant poisons. Style was a trapped decision for Flaubert, as it is for all his successors, because we are always in a relationship with style; indifference to style is no longer possible, and it is therefore converted into dilemma. Today, those writers who write "plainly" (the quotation marks register our self-consciousness), who leave style alone, must trudge along the plains looking at the mountains that they have chosen not to climb. And then, of course, the plainest writers now become "stylists" too, stylists of renunciation. Flaubert gave birth to Nabokov on one side and to Hemingway on the other. In short, Flaubert made the novel a painterly activity, and perhaps in so doing he threatened the novel with the danger of irrelevance. He aspired to write "a book about nothing, a book with no external attachment…. The most beautiful books are those with the least matter," he wrote in 1852; and in the same letter he wrote that "from the point of view of Art, there is no such thing as a subject, style being solely in itself an absolute way of seeing things."'

console.log('hello')

var hypertexted = nlp.spot(sampleText)



var findWords = function(text){
	var nreArray = nlp.spot(text)
	var matchWords = nreArray.map(function(element){
		return element.text
	})
	return matchWords

}

var showInstance = function(text){
	var nreArray = nlp.spot(text)
	var matchWords = nreArray.map(function(element){
		var instance = text.search(element)
		return instance
	})
	return matchWords

}


// STRING REPLACE TEST WITH FIRST SENTENCE

var sent = 'Indeed, fiction itself was felt as a kind of defeat by Flaubert, it became a vessel defined by what it could not hold.'

var find = nlp.spot(sent)[0]

var match = find.text

var addLink = match.replace(match,"<a>" + match + "</a>")

// STRING REPLACE TEST WITH FIRST SENTENCE

var sent = 'Indeed, fiction itself was felt as a kind of defeat by Flaubert, it became a vessel defined by what it could not hold.'

var find = nlp.spot(sent)[0]

var match = find.text

var addLink = match.replace(match,"<a>" + match + "</a>")

// basically working, but not accounting for multpile instances

var edit = function(input){
	var newText = input
	console.log(newText)
	var spotObjArray = nlp.spot(newText)
	var spotTextArray = spotObjArray.map(function(el){
		return el.text
	})

	spotTextArray.forEach(function(el){
		newText = newText.replace(el, "<a>" + el + "</a>")
	})
	console.log(newText)
	return newText
}

// ============================================
// working, using a regular expression. still not taking care of dupes


var edit = function(input){
	var newText = input
	var spotObjArray = nlp.spot(newText)
	var spotTextArray = spotObjArray.map(function(el){
		return el.text
	})

	spotTextArray.forEach(function(el){
		var re = new RegExp(el,'g')
		newText = newText.replace(re,"<a>" + el + "</a>")
	})

	return newText
}

$('a').click(function(event){
	var link = event.target
	var wordLength = link.length()-4
	var wordSearch = link.slice(2,wordLength)
	location.hash=wordSearch
	}
	)



