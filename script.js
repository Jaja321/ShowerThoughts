$('document').ready(function(){	
	$('#page').hide();
	$.getJSON("https://www.reddit.com/r/earthporn/top.json?sort=top&t=all&limit=100",function(json){
		var rand=Math.floor(Math.random() * 100);
		var post=json.data.children[rand].data;
		var url=post.url;
		var author=post.author;
		var title=post.title.toLowerCase();
		var imageurl=post.permalink;
		$('#imageurl').attr("href","http://www.reddit.com"+imageurl);
		$('#picby').html("Photo by: u/"+author);
		if(title.indexOf("[oc]")==-1){
			$('#r').hide();
		}
		betterUrl=tryConvertUrl(url);
		if(betterUrl!=''){
			url=betterUrl;
		}
		$('<img/>').attr('src', url).load(function() {
   			$(this).remove(); // prevent memory leaks
   			$('#loading').hide();
   			$('#page').css('background-image', "url("+url+")");		
   			$('#page').fadeIn("slow");
		});	
	});
	$.getJSON("https://www.reddit.com/r/showerthoughts/top.json?sort=top&t=all&limit=100",function(json){
		var rand=Math.floor(Math.random() * 100);
		var post=json.data.children[rand].data;
		var quote=post.title;
		var author=post.author;
		var quoteurl=post.permalink;
		$('#quote').html("\""+quote+"\"");
		$('#author').html("u/"+author);
		$('#quoteurl').attr("href","http://www.reddit.com"+quoteurl);
	});

});

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
	return '';
};