# HealthyNewLifestyle Google Apps Script forms

This folder contains the Google Apps Script Web App used by the customer
contact, newsletter-request, and product-review forms. The application proxies
submissions through its Next.js server route so the Apps Script URL and shared
secret are never exposed in browser code.

The Google integration is inactive until the business owner creates the sheet,
authorizes and deploys the script, and configures the website's server-side
environment variables.

## Forms and Sheets

`initializeSheets()` creates these tabs and their header rows:

| Tab | Form data |
| --- | --- |
| `Contact Enquiries` | Name, optional email, phone, topic, message, email-notification status |
| `Newsletter Requests` | Email address and submitted consent |
| `Product Reviews` | Product, rating, reviewer name, title, review, moderation-notification status |

Contact submissions and product reviews send a notification to the configured
business email. Reviews are for moderation; they are not published by this
integration. Newsletter requests are recorded for the team, but this project
does not automatically send newsletter campaigns or confirmation emails.

Checkout, payment, account-profile, and delivery workflows remain local
previews and are not submitted to Google Sheets.

## 1. Create a Google Sheet

1. Sign in to the Google account that should own customer-submission data.
2. Create a spreadsheet, for example **HealthyNewLifestyle Customer Forms**.
3. Copy the spreadsheet ID from its URL:

   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

Keep the spreadsheet private to staff who need access. Do not share customer
data, a spreadsheet URL, or credentials in source control or chat.

## 2. Add and authorize the Apps Script

1. In the spreadsheet, choose **Extensions → Apps Script**.
2. Replace the editor's `Code.gs` with the complete contents of this folder's
   `Code.gs`, then save.
3. Under **Project Settings → Script Properties**, add:

   | Property | Value |
   | --- | --- |
   | `SPREADSHEET_ID` | The ID copied from the spreadsheet URL |
   | `API_SHARED_SECRET` | A new random secret with at least 32 bytes of entropy |
   | `NOTIFICATION_EMAIL` | The business email that should receive contact/review notifications |

   Generate the shared secret locally, for example:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Enter the secret directly in Script Properties and the website's private
   environment configuration. Never put it in `Code.gs`, `.env.example`, a
   `NEXT_PUBLIC_` variable, GitHub, or a chat message.
4. Select `initializeSheets` in the function list and click **Run**. Review and
   approve the Google Sheets permission prompt.
5. Select `authorizeNotifications` and click **Run**. Review and approve the
   email permission prompt. This function checks the configured notification
   address and sends no email.
6. Confirm the three tabs and their headers exist.

## 3. Deploy the Web App

1. Choose **Deploy → New deployment**, then select **Web app**.
2. Set **Execute as** to **Me**.
3. Set **Who has access** to **Anyone**. Requests are checked against the
   private shared secret before any sheet is changed.
4. Deploy, complete any authorization prompt, and copy the Web App URL ending
   in `/exec`.

The web-app URL is server-side configuration. The shared secret is private.
Whenever `Code.gs` changes, create a new Apps Script version and update the
deployment to use it.

## 4. Configure the website

For local development, copy `.env.example` to `.env.local` in the frontend
project root and set:

```dotenv
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_SHARED_SECRET=your-private-random-secret
```

Use the deployed URL and the exact secret in Script Properties. `.env.local`
is ignored by Git. Restart the Next.js server after changing environment
variables.

For production, set both variables in the hosting provider's **server-side**
environment settings and redeploy. Neither variable may use a `NEXT_PUBLIC_`
prefix.

## 5. Test the forms

After configuration, submit test data you control and verify the corresponding
sheet rows:

1. `/contact`: submit a name, phone, topic, message, and optional email.
2. Homepage newsletter section: submit an email and check the consent box.
3. A product page: submit a rating, reviewer name, and review.

Contact and review rows should show `Sent` in the notification-status column
when the email is delivered, or `Failed` if Apps Script could not send it.
Failed notifications can be retried by resubmitting the same form values while
the page remains open; the browser retains the submission ID for that retry.
Review rows require manual moderation and publishing; this integration does
not make them public.

Do not use real customer data for testing. The integration is not live until
the owner has authorized the services, deployed the Web App, configured the
website environment, and verified test rows and notifications.

## Validation and duplicate handling

- The browser provides required fields and loading, success, and error states.
- The Next.js route and Apps Script independently validate form type, field
  sizes, email/phone formats, consent, ratings, and submission IDs.
- The server accepts only HTTPS Apps Script Web App URLs and never returns or
  logs the shared secret or submitted form contents.
- A script-wide lock plus the submission ID stored in the sheet prevents
  duplicate rows, including after the Apps Script cache expires.
- Potential spreadsheet-formula values are stored as plain text.
- Contact and product-review notification delivery is tracked in the sheet.
- If a notification fails after a row is saved, the form reports that the
  submission was recorded but the email could not be sent.

## Updating and troubleshooting

1. Edit and save `Code.gs` in the Apps Script editor.
2. Run `initializeSheets` if a new form tab was added; do not rename or reorder
   existing headers.
3. Run `authorizeNotifications` if email scopes or the notification recipient
   changed.
4. Create a new Web App deployment version and update the deployment.
5. No website code change is needed for a new deployment URL if the URL stays
   the same; update the hosting environment and redeploy if it changes.

| Symptom | Check |
| --- | --- |
| “Online form submissions are not configured yet” | Set both server-side environment variables and restart/redeploy. |
| “The enquiry service URL is invalid” | Use the HTTPS URL ending in `/macros/s/.../exec`. |
| Authorization error | Confirm `API_SHARED_SECRET` and the server secret match exactly. |
| Script is not configured | Set `SPREADSHEET_ID` and `API_SHARED_SECRET` in Script Properties. |
| Notification configuration error | Set a valid `NOTIFICATION_EMAIL` Script Property. |
| Notification status is `Failed` | Reauthorize `MailApp`, check the configured recipient and Google sending quota, then retry. |
| A sheet tab or row is missing | Run `initializeSheets` and confirm the script owner can edit the spreadsheet. |
| Sheet-header error | Restore the exact header row in `Code.gs`; existing data is not overwritten. |
| Deployment or authorization is blocked | Check Google Workspace policies and approve Sheets/Mail permissions as the owner. |

Restrict spreadsheet sharing to staff who need access and apply the business's
own data-retention and deletion practices. The site does not provide an
automated mailing-list manager or review publishing workflow.
