var appstore = chrome.storage.sync;

$('document').ready(function(){
    refresh(false);

    $('#refresh').click(function () {
        refresh(true);
    });
});

var refresh = function(force) {
	$('#loading').show();
	$('.content').hide();

    appstore.get(['date', 'shower', 'earth'], function(data) {
    	var today = (new Date()).toDateString();

    	if (!force && isValidData(data) && data.date == today) {
    		var earth = data.earth;
    		setEarthPorn(earth.author, earth.postUrl, earth.imageUrl);

    		var shower = data.shower;
    		setShowerThought(shower.author, shower.quote, shower.quoteUrl);

    	} else {
    		appstore.set({date: today}, null);
    		loadFromNetwork();
    	}
    });	
}

var isValidData = function (data) {
	return data != null && data.shower != null && data.earth != null && data.date != null;
}

var loadFromNetwork = function () {
	$.getJSON("https://www.reddit.com/r/earthporn/top.json?sort=top&t=month&limit=20",function(json){
		var rand=Math.floor(Math.random() * 20);
		var post=json.data.children[rand].data;
		var url=post.url;
		var author=post.author;
		var title=post.title.toLowerCase();
		var postUrl="http://www.reddit.com"+post.permalink;

		var imageUrl=tryConvertUrl(url);

		appstore.set({earth: {author: author, postUrl: postUrl, imageUrl: imageUrl}}, null);
		setEarthPorn(author, postUrl, imageUrl);
	});
	$.getJSON("https://www.reddit.com/r/showerthoughts/top.json?sort=top&t=month&limit=20",function(json) {
		var rand=Math.floor(Math.random() * 20);
		var post=json.data.children[rand].data;
		var quote=post.title;
		var author=post.author;
		var quoteUrl="http://www.reddit.com"+post.permalink;

		appstore.set({shower: {author: author, quote: quote, quoteUrl: quoteUrl}}, null);
		setShowerThought(author, quote, quoteUrl);
	});
}

var setEarthPorn = function (author, postUrl, imageUrl) {
	$('#picby').html("<a href='"+postUrl+"' target='_blank'>photo by u/"+author+"</a>");
	$('<img/>').attr('src', imageUrl).load(function() {
		$(this).remove(); // prevent memory leaks
		$('#loading').fadeOut("fast");

		$('#image').css('background-image', "url("+imageUrl+")");
		$('.content').fadeIn("slow");
	});	
}

var setShowerThought = function (author, quote, quoteUrl) {
	$('#quote').html("\""+quote+"\"");
	$('#author').html(" - <a href='"+quoteUrl+"' target='_blank'>u/"+author+"</a>");
}

var tryConvertUrl = function (url) {
	if (url.indexOf('imgur.com') > 0 || url.indexOf('/gallery/') > 0) {
		if (url.indexOf('gifv') >= 0) {
			if (url.indexOf('i.') === 0) {
				url = url.replace('imgur.com', 'i.imgur.com');
			}
			return url.replace('.gifv', '.gif');
		}
		if (url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0) {
			return '';
		}
		return url.replace(/r\/[^ \/]+\/(\w+)/, '$1') + '.jpg';
	}
	return url;
};