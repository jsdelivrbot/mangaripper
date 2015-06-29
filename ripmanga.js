MANGAHERE_URL = "http://www.mangahere.co/manga/oyasumi_punpun/";
CHAPTER = 1;
mangapagelinksarray = [];
producedlink = "";

function getShortURL(long_url, func) {
	accessToken =  '79f0eaaab371279e8fe0793e5b9e1e4b97be28b6';
	url = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + accessToken + '&longUrl=' + encodeURIComponent(long_url);

    $.getJSON(
        url, 
        { 
            "format": "json",
        },
        function(response)
        {
            func(response.data.url);
        }
    );
}

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

//http://james.padolsey.com/snippets/using-yql-with-jsonp/
function scrapechapters() {
	MANGAHERE_URL = document.getElementById("mangaherelink").value;
$.YQL("select * from html where url='" + MANGAHERE_URL + "'", function(data) {
	mangapage = document.createElement('p');

	mangapagelinksnumber = Object.keys(data.query.results.body.section.article.div.div[1].div[2].ul[0].li).length;
	addlinks = "";

	for (temp = 0; temp < mangapagelinksnumber; temp++) {
		mangapagelinksarray.push(JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.href).substring(1, JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.href).length - 1));
		addlinks += "<a href=\"javascript:updatenexturl(' + mangapagelinksarray[mangapagelinksarray.length - 1] + "')\">" + JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.content).substring(19, JSON.stringify(data.query.results.body.section.article.div.div[1].div[2].ul[0].li[temp].span[0].a.content).length - 13) + "</a></br>";
	}
	mangapage.innerHTML = addlinks;
	document.getElementsByTagName('body')[0].appendChild(mangapage);

	//updatenexturl(mangapagelinksarray[mangapagelinksarray.length - CHAPTER]);
});
}

function updatenexturl(currentnexturl) {
	$.YQL("select * from html where url='" + currentnexturl + "'", function(data) {
		console.log(JSON.stringify(data));
		producedlink += JSON.stringify(data.query.results.body.section[1].a.img.src).substring(1, JSON.stringify(data.query.results.body.section[1].a.img.src).length - 1);
		if (JSON.stringify(data.query.results.body.section[1].a.href).substring(1, JSON.stringify(data.query.results.body.section[1].a.href).length - 1) != "javascript:void(0);") {
			mangapage.innerHTML = JSON.stringify(data.query.results.body.section[1].a.href).substring(1, JSON.stringify(data.query.results.body.section[1].a.href).length - 1);
			updatenexturl(JSON.stringify(data.query.results.body.section[1].a.href).substring(1, JSON.stringify(data.query.results.body.section[1].a.href).length - 1));
		}
		else {
			producedlink = LZString.compressToEncodedURIComponent(producedlink);
			producedlink = "http://chilly.blue/mangaripper/result.html?&a=" + producedlink;
			getShortURL(producedlink, function(shortURL) {
				mangapage.innerHTML = "<a href=\"http://www.web2pdfconvert.com/engine?curl=" + escape(shortURL) + "&title=" + "DownloadedManga" + "&ref=imagebutton\">Download Manga</a>";
			});
		}
	});
}
