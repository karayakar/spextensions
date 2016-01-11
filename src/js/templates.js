var SPExt = SPExt || {};
SPExt.Templates = SPExt.Templates || {};

SPExt.Templates.RegisterAll = function (url) {
    url = SPClientTemplates.Utility.ReplaceUrlTokens(url);

    $.ajax({
        url: url,
        async: false,
        success: function (data) {
            $(data).each(function (index, value) {
                if (value.id) {
                    $.templates(value.id, $(value).text());
                }
            });
        }
    });
};

SPExt.Templates.Register = function (url, templateName) {
    url = SPClientTemplates.Utility.ReplaceUrlTokens(url);

    $.ajax(
	{
	    url: url,
	    async: false,
	    success: function (data) {
	        $.templates(templateName, data);
	    }
	});
};