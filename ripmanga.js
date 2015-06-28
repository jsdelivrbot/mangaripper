MANGAHERE_URL = "http://www.mangahere.co/manga/oyasumi_punpun/";
mangapagelinksarray = [];

$.YQL = function(query, callback) {

	if (!query || !callback) {
		throw new Error('$.YQL(): Parameters may be undefined');
	}

	encodedQuery = encodeURIComponent(query.toLowerCase()),
	url = 'http://query.yahooapis.com/v1/public/yql?q='
	+ encodedQuery + '&format=json&callback=?';

	$.ajax({
		url: url,
		dataType: 'json',
		async: false,
                cache: false,
		success: callback
	});

};


/* Usage: DOMReady(ajaxFunc); */
function DOMReady(f) {
    if (!document.all) {
        document.addEventListener("DOMContentLoaded", f, false);
    } else {
        if (document.readystate == 'complete') { 
            window.setTimeout(f, 0);
        }
        else {
            //Add event to onload just if all else fails
            attachEvent(window, "load", f);
        }
    }
}

//http://james.padolsey.com/snippets/using-yql-with-jsonp/
DOMReady($.YQL("select * from html where url='" + MANGAHERE_URL + "'", function(data) {
	mangapage = document.createElement('p');

	mangapagelinksnumber = Object.keys(data.query.results.body.section.article.div.div[1].div[2].ul[0].li).length;
	addlinks = "";

	for (temp = 0; temp < mangapagelinksnumber; temp++) {
		addlinks += "<a href=" + JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.href) + ">" + JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.content).substring(19, JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.content).length - 13) + "</a></br>";
		mangapagelinksarray.push(JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.href).substring(1, JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.href).length - 1));
	}

	document.getElementsByTagName('body')[0].appendChild(mangapage);

	$.YQL("select * from html where url='" + mangapagelinksarray[mangapagelinksarray.length-1] + "'", function(data) {
		console.log(mangapagelinksarray[mangapagelinksarray.length-2]);
		console.log(JSON.stringify(data.query.results.body.section[1].a.img.src).substring(1, JSON.stringify(data.query.results.body.section[1].a.img.src).length - 1));
		addlinks += "<img src=\"" + JSON.stringify(data.query.results.body.section[1].a.img.src).substring(1, JSON.stringify(data.query.results.body.section[1].a.img.src).length - 1) + "\"></img>";
		mangapage.innerHTML = addlinks;
	});
}));
