# Relationship Analytics Setup V3

Dataverse web resources for configuring mock Sales Premium / Relationship Analytics data from a Dynamics 365 command bar button.

## Contents

- `WebResources/mjts_ra_setup_v3.html` - main setup modal web resource.
- `WebResources/mjts_ra_setup_v3_ribbon.js` - command bar JavaScript entry point.
- `preview/ra-setup-v3-preview.html` - standalone browser preview for the setup experience.

## What It Does

- Configures predictive score, score reasons, Most contacted, Day KPIs, Who knows whom, Lifetime KPIs, and Opportunity Similar won deals.
- Includes a Utilities wipe flow for demo data cleanup.
- Provides a standalone preview that can be opened directly in a browser.

## Notes

This repository contains only the web resource and preview files. Dataverse environment connection details are intentionally excluded from source control.
