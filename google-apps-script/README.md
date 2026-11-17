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
| `Contact Enquiries` | Name, required email, phone, subject, message, admin/customer email statuses |
| `Newsletter Requests` | Email address, submitted consent, confirmation status |
| `Product Reviews` | Product, rating, reviewer name, title, review, moderation-notification status |

Contact submissions send an admin notification and a submission-confirmation
email to the customer. The admin notification sets `Reply-To` to the customer's
email, so staff can reply from their normal email client and the customer
receives that response by email. The customer confirmation sets `Reply-To` to
the configured admin address.

Newsletter submissions require the existing consent checkbox and send only a
transactional receipt confirmation. No marketing campaign or follow-up
newsletter is sent by this integration. Product reviews send a notification to
the configured business email and remain unpublished until manually moderated.
Failed customer/admin email deliveries are tracked and can be retried with the
same submission ID without creating a duplicate sheet row.

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
   | `NOTIFICATION_EMAIL` | The admin email that receives contact/review notifications and customer replies |

   Generate the shared secret locally, for example:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Enter the secret directly in Script Properties and the website's private
   environment configuration. Never put it in `Code.gs`, `.env.example`, a
   `NEXT_PUBLIC_` variable, GitHub, or a chat message.
4. Select `initializeSheets` in the function list and click **Run**. Review and
   approve the Google Sheets permission prompt. Existing form tabs are upgraded
   by appending status columns; existing data and submission-ID columns are
   preserved.
5. Select `authorizeNotifications` in the function list and click **Run**.
   Review and approve the Google email-sending permission prompt. This function
   checks the configured admin address and sends no email.
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

1. `/contact`: submit a name, email, phone, subject, and message. Verify the
   admin email, customer confirmation, and that the admin message's Reply
   action addresses the customer.
2. Homepage newsletter section: submit an email and check the consent box.
   Verify that only a request-received confirmation is sent.
3. A product page: submit a rating, reviewer name, and review.

Contact rows track admin notification and customer confirmation separately;
newsletter rows track confirmation delivery, and reviews track their admin
notification. A status is `Sent` only after `MailApp.sendEmail` returns; it is
`Failed` when the send call throws. Failed deliveries can be retried from the
page while it remains open; the browser retains the submission ID and the
script retries only the email with a non-`Sent` status.
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
- Admin notifications and customer confirmations are tracked separately.
- A form can be recorded even if an email fails; the UI reports that delivery
  status and offers a retry without creating another row.
- Contact requires a customer email address so the confirmation and direct
  admin reply can be delivered.
- Newsletter confirmation is sent only after explicit consent, and is not a
  marketing email.
- The existing `/admin` page does not provide authenticated enquiry management.
  Admin replies are made from the notification email's Reply action; this
  avoids exposing an unauthenticated email-sending endpoint.

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
| Any email status is `Failed` | Reauthorize `MailApp`, check the admin recipient and Google sending quota, then use the form's retry action. |
| A sheet tab or row is missing | Run `initializeSheets` and confirm the script owner can edit the spreadsheet. |
| Sheet-header error | Restore the exact header row in `Code.gs`; existing data is not overwritten. |
| Deployment or authorization is blocked | Check Google Workspace policies and approve Sheets/Mail permissions as the owner. |

Restrict spreadsheet sharing to staff who need access and apply the business's
own data-retention and deletion practices. The site does not provide an
automated mailing-list manager or review publishing workflow.
