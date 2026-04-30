"use strict";
var RelationshipAnalyticsSetupV3 = RelationshipAnalyticsSetupV3 || {};

(function (ns) {
    // Opens the Relationship Analytics Setup V3 modal from the command bar of
    // lead / opportunity / contact / account. primaryControl can be a form,
    // grid, or Focused View side-pane context depending on where the command ran.
    ns.openSetup = function (primaryControl, selectedItemIds, selectedEntityTypeName) {
        var Xrm = window.Xrm;

        function normalizeId(id) {
            return (id || "").toString().replace(/[{}]/g, "").toLowerCase();
        }

        function firstArrayValue(value) {
            if (!value) return "";
            if (Array.isArray(value)) return value.length ? value[0] : "";
            if (typeof value === "string" && value.indexOf(",") >= 0) return value.split(",")[0];
            return value;
        }

        function supportedEntity(name) {
            name = (name || "").toString().toLowerCase();
            return name === "lead" || name === "opportunity" || name === "contact" || name === "account";
        }

        function getFormContext(control) {
            if (!control) return null;
            try {
                if (typeof control.getFormContext === "function") return control.getFormContext();
            } catch (e) {}
            return control.data && control.data.entity ? control : null;
        }

        function refFromForm(formContext) {
            try {
                if (!formContext || !formContext.data || !formContext.data.entity) return null;
                var entity = formContext.data.entity;
                var entityName = entity.getEntityName ? entity.getEntityName() : "";
                var entityId = entity.getId ? entity.getId() : "";
                if (entityName && entityId) return { entityName: entityName, entityId: normalizeId(entityId), source: "form" };
            } catch (e) {}
            return null;
        }

        function refFromGrid(control) {
            try {
                var grid = null;
                if (control && typeof control.getGrid === "function") grid = control.getGrid();
                if (!grid && control && typeof control.getControl === "function") {
                    var inner = control.getControl();
                    if (inner && typeof inner.getGrid === "function") grid = inner.getGrid();
                }
                if (!grid || typeof grid.getSelectedRows !== "function") return null;
                var rows = grid.getSelectedRows();
                var row = null;
                if (rows && typeof rows.getLength === "function" && rows.getLength() > 0 && typeof rows.get === "function") row = rows.get(0);
                if (!row && rows && typeof rows.getAll === "function") {
                    var all = rows.getAll();
                    row = all && all.length ? all[0] : null;
                }
                if (!row || typeof row.getData !== "function") return null;
                var rowEntity = row.getData().getEntity();
                if (!rowEntity) return null;
                var ref = rowEntity.getEntityReference ? rowEntity.getEntityReference() : null;
                var entityName = (ref && (ref.entityType || ref.entityName || ref.name)) || (rowEntity.getEntityName ? rowEntity.getEntityName() : "");
                var entityId = (ref && ref.id) || (rowEntity.getId ? rowEntity.getId() : "");
                if (entityName && entityId) return { entityName: entityName, entityId: normalizeId(entityId), source: "grid" };
            } catch (e) {}
            return null;
        }

        function refFromArguments(ids, entityType) {
            var entityId = normalizeId(firstArrayValue(ids));
            var entityName = (entityType || "").toString().toLowerCase();
            if (entityId && entityName) return { entityName: entityName, entityId: entityId, source: "arguments" };
            return null;
        }

        function resolveContext(control, ids, entityType) {
            var refs = [
                refFromArguments(ids, entityType),
                refFromGrid(control),
                refFromForm(getFormContext(control)),
                refFromForm(Xrm && Xrm.Page)
            ];
            for (var i = 0; i < refs.length; i++) {
                if (refs[i] && refs[i].entityId && supportedEntity(refs[i].entityName)) return refs[i];
            }
            return null;
        }

        try {
            var context = resolveContext(primaryControl, selectedItemIds, selectedEntityTypeName);
            if (!context || !context.entityId) {
                console.log("Relationship Analytics Setup V3: record must be saved before opening setup.");
                Xrm && Xrm.Navigation && Xrm.Navigation.openAlertDialog({ text: "Please save the record before opening Relationship Analytics Setup V3." });
                return;
            }

            console.log("Relationship Analytics Setup V3: opening for", context.entityName, context.entityId, "from", context.source);

            var pageInput = {
                pageType: "webresource",
                webresourceName: "mjts_ra_setup_v3.html",
                data: "entityId=" + encodeURIComponent(context.entityId) + "&entityName=" + encodeURIComponent(context.entityName)
            };
            var navigationOptions = {
                target: 2,
                width: { value: 1040, unit: "px" },
                height: { value: 760, unit: "px" },
                position: 1,
                title: "Relationship Analytics Setup V3"
            };

            Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
                function () { console.log("Relationship Analytics Setup V3: closed."); },
                function (err) { console.log("Relationship Analytics Setup V3: navigateTo failed", err); }
            );
        } catch (e) {
            console.log("Relationship Analytics Setup V3: openSetup error", e);
        }
    };
})(RelationshipAnalyticsSetupV3);
