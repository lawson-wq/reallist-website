# Reallist MVP Website Pack

This is a static MVP for reallist.co.nz.

## Fastest launch path
1. Create a free Netlify account.
2. Drag this folder into Netlify Deploys.
3. Netlify Forms will capture: property-enquiry, seller-intake, contact.
4. Point www.reallist.co.nz DNS to Netlify.
5. Replace sample listings in `data/listings.js` with real approved listings.
6. Replace Unsplash images with real property photos.

## Recommended backend after launch
Use Airtable as CRM/database + Fillout forms embedded on pages.
Tables:
- Listings
- Enquiries
- Document Requests
- Private private viewing requests
- Offers
- Seller Reports
- Vendors
- Buyers

Use Make.com automation:
- New enquiry -> Airtable record + email to Lawson
- Weekly Friday -> generate seller report from Airtable + send PDF/email

## Compliance notes
Before launch, confirm licensed agency wording, privacy policy, vendor approval, photo permission, and property information disclaimers.

## Data notes
Do not scrape or republish CoreLogic/Property Guru data unless your licence permits it. Use manual verified entries or public council/vendor-provided data. Cite/source data clearly.


## Brand language locked for MVP
Primary slogan: Real Price. No Games.
Hero subtitle: Property sales without the guessing game.
Secondary subtitle: Real listings. Real prices. Real decisions.
About intro: Clear asking prices, honest property information, and a straightforward offer process. Reallist is operated by Climber Real Estate for serious sellers and serious buyers.

## MVP language strategy
First version is English only. Keep the website simple and focused. Chinese content can be added later after listings and enquiry flow are proven.

## Data notes
- Council CV should be entered for every listing using council rating information.
- Nearby sales should be shown as: Nearby sales available on request. Do not scrape or republish third-party sales data without permission.


V9 update: Climber-style orange accent applied to the Reallist logo, Buy page filters added, and homepage/listing cards shortened to key facts only.


V11 note: Added 146 Seabrook Avenue with a temporary placeholder image because the provided Trade Me photo link points to the Pukekohe listing, not the New Lynn property. Replace assets/placeholder-seabrook.svg with the correct approved photo set before public launch.


## V16 update
- Added an Auckland area dropdown to the Buy page using Trade Me-style Auckland property districts: Auckland City, Franklin, Hauraki Gulf Islands, Manukau City, North Shore City, Papakura, Rodney, Waiheke Island and Waitakere City.
- Added a `region` field to each listing so future listings can be matched by Auckland area.
- Kept suburb and school search as keyword fields for more flexible matching.


V17 update: Buy page School zone filter is now a dropdown using current Trade Me school-zone names in the listing data. Add new school names to buy.html when new listings are added.
