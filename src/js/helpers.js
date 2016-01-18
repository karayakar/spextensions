var SPExt = SPExt || {};

SPExt.LoadCss = function (url) {
    url = SPClientTemplates.Utility.ReplaceUrlTokens(url);

    var link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
};

SPExt.OpenInDialog = function (url, options) {
    options = options || {
        url: url,
        allowMaximize: true,
        showClose: true
    };

    SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showModalDialog", options);
};

SPExt.CreateGUID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
};

SPExt.GetFormTable = function () {
    return $("#part1 .ms-formtable");
};