$('document').ready(function(){	
	$('.content').hide();

	$.getJSON("https://www.reddit.com/r/earthporn/top.json?sort=top&t=all&limit=100",function(json){
		var rand=Math.floor(Math.random() * 100);
		var post=json.data.children[rand].data;
		var url=post.url;
		var author=post.author;
		var title=post.title.toLowerCase();
		var imageurl="http://www.reddit.com"+post.permalink;
		$('#picby').html("<a href='"+imageurl+"' target='_blank'>photo by u/"+author+"</a>");
		if(title.indexOf("[oc]")==-1){
			$('#r').hide();
		}
		betterUrl=tryConvertUrl(url);
		if(betterUrl!=''){
			url=betterUrl;
		}
		$('<img/>').attr('src', url).load(function() {
   			$(this).remove(); // prevent memory leaks
   			$('#loading').fadeOut("fast");

   			$('#image').css('background-image', "url("+url+")");		
   			$('.content').fadeIn("slow");
		});	
	});
	$.getJSON("https://www.reddit.com/r/showerthoughts/top.json?sort=top&t=all&limit=100",function(json) {
		var rand=Math.floor(Math.random() * 100);
		var post=json.data.children[rand].data;
		var quote=post.title;
		var author=post.author;
		var quoteurl="http://www.reddit.com"+post.permalink;
		$('#quote').html("\""+quote+"\"");
		$('#author').html(" - <a href='"+quoteurl+"' target='_blank'>u/"+author+"</a>");
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