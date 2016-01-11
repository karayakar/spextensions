var SPExt = SPExt || {};
SPExt.CSR = SPExt.CSR || {};

SPExt.CSR.RegisterTemplateOverride = function (templateCtx) {
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(templateCtx);
};

// If MDS is activated then register this and the common file as module and execute CSR
SPExt.CSR.MdsRegisterTemplateOverride = function (templateCtx, fileNames) {
    if (Object.prototype.toString.call(fileNames) !== '[object Array]') {
        fileNames = [].concat(fileNames);
    }

    var fileName = filesNames.shift();
    if (fileName == null) return;

    fileName = SPClientTemplates.Utility.ReplaceUrlTokens(fileName);
    RegisterModuleInit(fileName, function () {
        if (fileNames.length > 0) {
            SPExt.CSR.MdsRegisterTemplateOverride(templateCtx, fileNames);
        } else {
            SPExt.CSR.RegisterTemplateOverride(templateCtx);
        }
    });
};

SPExt.CSR.Register = function (templateCtx, fileNames) {
    if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
        SPExt.CSR.MdsRegisterTemplateOverride(templateCtx, fileNames);
    } else {
        SPExt.CSR.RegisterTemplateOverride(templateCtx);
    }
};