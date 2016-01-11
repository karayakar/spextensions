var SPExt = SPExt || {};
SPExt.ClientTemplates = SPExt.ClientTemplates || {};

SPExt.ClientTemplates.DefaultFieldWithValidationTemplate = function (ctx, validator) {
    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);

    // Include validators
    var validators = new SPClientForms.ClientValidation.ValidatorSet();
    validators.RegisterValidator(validator);
    formCtx.registerClientValidator(formCtx.fieldName, validators);

    // Return html for element
    var fieldType = ctx.CurrentFieldSchema.FieldType;
    var defaultTemplates = SPClientTemplates._defaultTemplates.Fields.default.all.all;
    return defaultTemplates[fieldType][ctx.BaseViewID](ctx);
};

SPExt.ClientTemplates.PrefilledUserFieldTemplate = function (ctx, user, readonly) {
    if (!user) {
        $.when(SPExt.User.GetSelfProfile(null, null, false)).then(function (data) {
            user = {
                AccountName: data.d.DisplayName,
                DisplayName: data.d.AccountName
            };
        });
    }

    var escapedUserName = user.AccountName;
    var userAccountName = "i:0#.w|" + escapedUserName;
    var currentUserEntry = {
        Description: userAccountName,
        DisplayText: user.DisplayName,
        EntityType: "User",
        IsResolved: true,
        HierarchyIdentifier: null,
        Key: userAccountName,
        MultipleMatches: [],
        ProviderDisplayName: "Active Directory",
        ProviderName: "AD",
        EntityData: {
            Title: "",
            MobilePhone: "",
            SIPAddress: "",
            Department: "",
            Email: ""
        },
        AutoFillKey: userAccountName,
        AutoFillDisplayText: escapedUserName,
        AutoFillSubDisplayText: "",
        AutoFillTitleText: "ActiveDirectory\\n" + escapedUserName,
        DomainText: "ASBNET",
        LocalSearchTerm: user.DisplayName,
        Resolved: true
    };

    //Set user default value
    ctx.CurrentFieldValue = [];
    ctx.CurrentFieldValue.push(currentUserEntry);

    if (readonly) {
        var fieldInternalName = ctx.CurrentFieldSchema.Name;
        var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        var fieldId = String.format("{0}_{1}_${2}Field", formCtx.fieldSchema.Name, formCtx.fieldSchema.Id, formCtx.fieldSchema.FieldType);
        var val = ctx.CurrentFieldValue.slice();

        // Value callback
        formCtx.registerGetValueCallback(ctx.CurrentFieldSchema.Name, function () {
            return JSON.stringify(val);
        });

        // If readonly parameter set then only show users display name
        return "<span id='" + fieldId + "'>" + user.DisplayName + "</span>";
    }

    return SPClientPeoplePickerCSRTemplate(ctx);
};
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
var SPExt = SPExt || {};
SPExt.Forms = SPExt.Forms || {};

SPExt.Forms.RenderCustom = function (ctx, codeTokenUrl, templateName) {
    var renderCtx = {
        ListSchema: WPQ2FormCtx.ListSchema,
        FormUniqueId: ctx.FormUniqueId,
        ListId: ctx.FormContext.listAttributes.Id,
        ControlMode: ctx.ControlMode
    };

    // Define template helpers
    $.views.helpers({
        encodeLinkBreaks: function (value) {
            return value.replace(/(?:\r\n|\r|\n)/g, "<br />");
        }
    });

    // Render template and hide old form (removal breaks attachment form)
    // First item needs to be replaced because SharePoint already has pointer to it -> clientrenderer.debug.js line 77
    var el = $("tr > td > span#" + ctx.FormUniqueId + ctx.FormContext.listAttributes.Id + ctx.ListSchema.Field[0].Name);
    var table = $("#WebPart" + ctx.FormUniqueId + " .ms-formtable");

    var container = $("<div />", {
        id: "ClientForm" + ctx.FormUniqueId
    });
    container.insertBefore(table);
    var tmpl = $.link[templateName](container, renderCtx);

    table.remove();
    $("tr > td > span#" + ctx.FormUniqueId + ctx.FormContext.listAttributes.Id + ctx.ListSchema.Field[0].Name).replaceWith(el);

    return { renderCtx: renderCtx, tmpl: tmpl };
};
var SPExt = SPExt || {};

SPExt.LoadCss = function (url) {
    url = SPClientTemplates.Utility.ReplaceUrlTokens(url);

    var link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
};

SPExt.OpenInDialog = function (url) {
    var options = {
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
var SPExt = SPExt || {};
SPExt.User = SPExt.User || {};

// Threadsafe user profile retrieval
var userProfilePromise;
SPExt.User.GetSelfProfile = function (url, query, async) {
    if (userProfilePromise) return userProfilePromise;

    query = query || "";
    url = url || _spPageContextInfo.webServerRelativeUrl;

    userProfilePromise = $.ajax({
        async: async,
        url: url + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties" + query,
        headers: { "Accept": "application/json; odata=verbose" }
    });

    return userProfilePromise;
};

// Retrieve a single user profile property
SPExt.User.GetProperty = function (propertyName, userProfileProperties) {
    for (var i = 0; i < userProfileProperties.results.length; i++) {
        var result = userProfileProperties.results[i];
        if (result.Key == propertyName) {
            return result.Value;
        }
    }
};

// Retrieve the full user address in the format Street\nPLZ-City
SPExt.User.GetFullAddress = function () {
    return $.Deferred(function (defer) {
        SPExt.User.GetSelfProfile().then(function (data) {
            var streetAddress = SPExt.User.GetProperty("streetAddress", data.d.UserProfileProperties);
            var postalCode = SPExt.User.GetProperty("postalCode", data.d.UserProfileProperties);
            var spsLocation = SPExt.User.GetProperty("SPS-Location", data.d.UserProfileProperties);

            if (streetAddress != null && streetAddress != "" &&
					postalCode != null && postalCode != "" &&
					spsLocation != null && spsLocation != "") {
                var address = streetAddress + "\n" + postalCode + "-" + spsLocation;
                return defer.resolve(address);
            }

            return defer.reject("Empty user address");
        }, defer.reject);
    }).promise();
};
var SPExt = SPExt || {};
SPExt.Validation = SPExt.Validation || {};

// Define validators
SPExt.Validation.NotNullValidator = function () { };
SPExt.Validation.NotNullValidator.prototype.Validate = function (value) {
    var hasError = (value == null || value == "");
    var errorMsg = hasError ? "Der Wert darf nicht leer gelassen werden." : "";

    return new SPClientForms.ClientValidation.ValidationResult(hasError, errorMsg);
};