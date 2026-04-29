"use strict";
var RelationshipAnalyticsSetupV3 = RelationshipAnalyticsSetupV3 || {};

(function (ns) {
    // Opens the Relationship Analytics Setup V3 modal from the command bar of
    // lead / opportunity / contact / account. primaryControl is the form context.
    ns.openSetup = function (primaryControl) {
        try {
            var formContext = primaryControl;
            var entityName = formContext.data.entity.getEntityName();
            var entityId = formContext.data.entity.getId();
            if (!entityId) {
                console.log("Relationship Analytics Setup V3: record must be saved before opening setup.");
                var Xrm = window.Xrm;
                Xrm && Xrm.Navigation && Xrm.Navigation.openAlertDialog({ text: "Please save the record before opening Relationship Analytics Setup V3." });
                return;
            }
            entityId = entityId.replace(/[{}]/g, "").toLowerCase();

            var pageInput = {
                pageType: "webresource",
                webresourceName: "mjts_ra_setup_v3.html",
                data: "entityId=" + encodeURIComponent(entityId) + "&entityName=" + encodeURIComponent(entityName)
            };
            var navigationOptions = {
                target: 2,
                width: { value: 1040, unit: "px" },
                height: { value: 760, unit: "px" },
                position: 1,
                title: "Relationship Analytics Setup V3"
            };

            window.Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
                function () { console.log("Relationship Analytics Setup V3: closed."); },
                function (err) { console.log("Relationship Analytics Setup V3: navigateTo failed", err); }
            );
        } catch (e) {
            console.log("Relationship Analytics Setup V3: openSetup error", e);
        }
    };
})(RelationshipAnalyticsSetupV3);
