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
        DomainText: "",
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