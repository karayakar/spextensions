var SPExt = SPExt || {};
SPExt.Forms = SPExt.Forms || {};

SPExt.Forms.RenderCustom = function (ctx, templateName, renderCtx) {
    renderCtx = renderCtx || {
        ListSchema: WPQ2FormCtx.ListSchema,
        ListData: WPQ2FormCtx.ListData,
        ListId: ctx.FormContext.listAttributes.Id,
        FormUniqueId: ctx.FormUniqueId,
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