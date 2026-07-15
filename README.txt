AL-HAFIZ ISLAMIC RESEARCH INSTITUTE — HEROKU DEPLOYMENT PACKAGE
==================================================================
This package is set up as ONE app: the website AND its API are
served together by server.js, so deploying to Heroku is a single
deploy — no separate front-end/back-end hosting needed.

FOLDER STRUCTURE
-----------------
- server.js         Express server — serves the website AND the API
- package.json       Dependencies + start command (Heroku reads this)
- Procfile           Tells Heroku how to start the app
- models/            MongoDB data models (User, Review)
- routes/            API endpoints (/api/auth/..., /api/reviews)
- public/            The actual website (all .html, css/, js/)

STEP 1 — CREATE A FREE MONGODB DATABASE
-----------------------------------------
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up free.
2. Create a free "M0" cluster (any name, any nearby region).
3. Under "Database Access", add a database user (username + password
   — save these, you'll need them).
4. Under "Network Access", click "Add IP Address" > "Allow access
   from anywhere" (0.0.0.0/0) — simplest option, works well with
   Heroku since its servers don't have a fixed IP.
5. Click "Connect" on your cluster > "Drivers" > copy the connection
   string (looks like mongodb+srv://USER:PASS@cluster0.xxxxx...).
   Replace USER/PASS with the ones from step 3.

STEP 2 — DEPLOY TO HEROKU
----------------------------
Option A — Heroku CLI (recommended):
  1. Install the Heroku CLI and run: heroku login
  2. From inside this project folder:
       git init
       git add .
       git commit -m "Al-Hafiz website"
       heroku create your-app-name
       git push heroku main
     (if your default branch is "master", use: git push heroku master)

Option B — Heroku Dashboard:
  1. Push this folder to a GitHub repository.
  2. On https://dashboard.heroku.com, click "New" > "Create new app".
  3. Under "Deploy", connect it to your GitHub repo and deploy the
     main branch.

STEP 3 — SET CONFIG VARS (Heroku's equivalent of a .env file)
------------------------------------------------------------------
In the Heroku Dashboard > your app > Settings > "Reveal Config Vars",
add:
  MONGODB_URI     = your connection string from Step 1
  JWT_SECRET      = any long random text (mash your keyboard)
  ALLOWED_ORIGIN  = https://your-app-name.herokuapp.com

Or via CLI:
  heroku config:set MONGODB_URI="mongodb+srv://..." JWT_SECRET="..." ALLOWED_ORIGIN="https://your-app-name.herokuapp.com"

Heroku sets PORT automatically — you don't need to set it.

STEP 4 — VISIT YOUR SITE
---------------------------
Once deployed, https://your-app-name.herokuapp.com will show the
website, and Login/Register/Reviews will read and write to your real
MongoDB database — shared across every visitor, on every device.

TESTING LOCALLY BEFORE DEPLOYING (optional)
----------------------------------------------
  1. Copy .env.example to .env and fill in MONGODB_URI and JWT_SECRET.
  2. npm install
  3. npm start
  4. Open http://localhost:5000 in your browser — this runs the exact
     same server.js Heroku will run, serving both the site and the API.

NOTE ON THE AI CHATBOT
------------------------
The on-site chatbot currently answers from a built-in list of your
services (no setup needed, free to run). If you'd like it upgraded to
a true AI assistant (e.g. using the Anthropic API), that can be added
as another route on this same server — the API key would live safely
in a Heroku Config Var, never in the website's front-end code. Just
ask if you'd like this added.

CONTACT DETAILS USED IN THE SITE
-----------------------------------
WhatsApp (primary / floating button): 0306-1819635
WhatsApp (support chat number):        0332-0033563
WhatsApp Channel, TikTok and Facebook links are in the footer and
Contact page. Founder name shown throughout: Hafiz Mahmood
