const SHEET_CONFIG = {
  contact: {
    sheetName: "Contact Enquiries",
    headers: [
      "Submitted At",
      "Name",
      "Email",
      "Phone",
      "Topic",
      "Message",
      "Notification Status",
      "Submission ID",
      "Customer Confirmation Status",
    ],
    idColumn: 8,
    adminNotificationStatusColumn: 7,
    customerConfirmationStatusColumn: 9,
    legacyHeaderCount: 8,
  },
  newsletter: {
    sheetName: "Newsletter Requests",
    headers: [
      "Submitted At",
      "Email",
      "Consent",
      "Submission ID",
      "Confirmation Status",
    ],
    idColumn: 4,
    customerConfirmationStatusColumn: 5,
    legacyHeaderCount: 4,
  },
  review: {
    sheetName: "Product Reviews",
    headers: [
      "Submitted At",
      "Product ID",
      "Product Name",
      "Rating",
      "Name",
      "Title",
      "Review",
      "Notification Status",
      "Submission ID",
    ],
    idColumn: 9,
    adminNotificationStatusColumn: 8,
  },
};

const DUPLICATE_TTL_SECONDS = 21600;

function doGet() {
  return jsonResponse_({
    success: true,
    service: "HealthyNewLifestyle Customer Forms",
  });
}

function doPost(event) {
  try {
    const request = parseRequest_(event);
    const properties = PropertiesService.getScriptProperties();
    const expectedKey = properties.getProperty("API_SHARED_SECRET");
    const spreadsheetId = properties.getProperty("SPREADSHEET_ID");

    if (!expectedKey || !spreadsheetId) {
      throw new Error("SERVICE_NOT_CONFIGURED");
    }
    if (typeof request.apiKey !== "string" || request.apiKey !== expectedKey) {
      throw new Error("UNAUTHORIZED");
    }

    const submission = validateSubmission_(request);
    const adminEmail =
      submission.operation === "contact" || submission.operation === "review"
        ? getNotificationEmail_()
        : "";
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const config = SHEET_CONFIG[submission.operation];
      const sheet = getOrCreateSheet_(spreadsheet, config);
      const idColumn = config.idColumn;
      const cache = CacheService.getScriptCache();
      const cacheKey = submission.operation + ":" + submission.submissionId;
      const cachedRow = Number(cache.get(cacheKey));
      let rowNumber =
        Number.isInteger(cachedRow) &&
        cachedRow >= 2 &&
        sheet.getRange(cachedRow, idColumn).getDisplayValue() ===
          submission.submissionId
          ? cachedRow
          : findSubmissionRow_(sheet, idColumn, submission.submissionId);
      const duplicate = rowNumber !== null;

      if (!duplicate) {
        const row = buildRow_(submission);
        sheet.appendRow(row.map(safeSheetValue_));
        rowNumber = sheet.getLastRow();
        cache.put(cacheKey, String(rowNumber), DUPLICATE_TTL_SECONDS);
      }

      if (submission.operation === "contact") {
        const adminNotificationSent = sendEmailIfNeeded_(
          sheet,
          rowNumber,
          config.adminNotificationStatusColumn,
          function () {
            sendContactNotification_(adminEmail, submission);
          },
        );
        const customerConfirmationSent = sendEmailIfNeeded_(
          sheet,
          rowNumber,
          config.customerConfirmationStatusColumn,
          function () {
            sendContactConfirmation_(adminEmail, submission);
          },
        );
        cache.put(cacheKey, String(rowNumber), DUPLICATE_TTL_SECONDS);
        return jsonResponse_({
          success: true,
          duplicate: duplicate,
          adminNotificationSent: adminNotificationSent,
          customerConfirmationSent: customerConfirmationSent,
        });
      }

      if (submission.operation === "newsletter") {
        const customerConfirmationSent = sendEmailIfNeeded_(
          sheet,
          rowNumber,
          config.customerConfirmationStatusColumn,
          function () {
            sendNewsletterConfirmation_(submission);
          },
        );
        cache.put(cacheKey, String(rowNumber), DUPLICATE_TTL_SECONDS);
        return jsonResponse_({
          success: true,
          duplicate: duplicate,
          customerConfirmationSent: customerConfirmationSent,
        });
      }

      const notificationSent = sendEmailIfNeeded_(
        sheet,
        rowNumber,
        config.adminNotificationStatusColumn,
        function () {
          sendReviewNotification_(adminEmail, submission);
        },
      );
      cache.put(cacheKey, String(rowNumber), DUPLICATE_TTL_SECONDS);
      return jsonResponse_({
        success: true,
        duplicate: duplicate,
        notificationSent: notificationSent,
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    const code = error && error.message ? String(error.message) : "";
    const messages = {
      INVALID_REQUEST: "The submitted form data is invalid.",
      INVALID_OPERATION: "Choose a valid form type.",
      INVALID_NAME: "Enter a valid name.",
      INVALID_EMAIL: "Enter a valid email address.",
      INVALID_PHONE: "Enter a valid phone number.",
      INVALID_TOPIC: "Choose a valid enquiry topic.",
      INVALID_MESSAGE: "Enter a valid message.",
      INVALID_CONSENT: "Confirm your newsletter subscription consent.",
      INVALID_PRODUCT: "The product information is invalid.",
      INVALID_RATING: "Choose a rating from 1 to 5.",
      INVALID_TITLE: "The review title is invalid.",
      INVALID_SUBMISSION_ID: "The submission could not be verified.",
      UNAUTHORIZED: "The enquiry service authorization failed.",
      SERVICE_NOT_CONFIGURED: "The enquiry service has not been configured.",
      NOTIFICATION_NOT_CONFIGURED:
        "Set a valid NOTIFICATION_EMAIL script property before accepting this form.",
      SHEET_HEADERS_INVALID: "The target sheet headers need to be restored.",
    };
    const message =
      messages[code] ||
      "The submission could not be saved. Please try again later.";
    return jsonResponse_({
      success: false,
      error: message,
      code: code || "ERROR",
    });
  }
}

function initializeSheets() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Set the SPREADSHEET_ID script property before initialization.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  Object.keys(SHEET_CONFIG).forEach(function (operation) {
    getOrCreateSheet_(spreadsheet, SHEET_CONFIG[operation]);
  });
}

function authorizeNotifications() {
  const recipient = getNotificationEmail_();
  MailApp.getRemainingDailyQuota();
  return "Email notifications are authorized for " + recipient + ".";
}

function parseRequest_(event) {
  if (!event || !event.postData || typeof event.postData.contents !== "string") {
    throw new Error("INVALID_REQUEST");
  }
  if (event.postData.contents.length > 20000) {
    throw new Error("INVALID_REQUEST");
  }

  try {
    const request = JSON.parse(event.postData.contents);
    if (!request || typeof request !== "object" || Array.isArray(request)) {
      throw new Error("INVALID_REQUEST");
    }
    return request;
  } catch (error) {
    throw new Error("INVALID_REQUEST");
  }
}

function validateSubmission_(request) {
  const operation = request.operation;
  if (!Object.prototype.hasOwnProperty.call(SHEET_CONFIG, operation)) {
    throw new Error("INVALID_OPERATION");
  }

  const submissionId = requiredText_(request.submissionId, 80, "INVALID_SUBMISSION_ID");
  if (!/^[A-Za-z0-9-]{20,80}$/.test(submissionId)) {
    throw new Error("INVALID_SUBMISSION_ID");
  }

  if (operation === "contact") {
    const name = requiredText_(request.name, 100, "INVALID_NAME");
    const email = requiredText_(request.email, 254, "INVALID_EMAIL").toLowerCase();
    const phone = requiredText_(request.phone, 30, "INVALID_PHONE");
    const topic = requiredText_(request.topic, 120, "INVALID_TOPIC");
    const message = requiredText_(request.message, 5000, "INVALID_MESSAGE");
    validateName_(name);
    if (!isValidEmail_(email)) {
      throw new Error("INVALID_EMAIL");
    }
    if (/[\u0000-\u001f\u007f]/.test(topic)) {
      throw new Error("INVALID_TOPIC");
    }
    validatePhone_(phone);

    return {
      operation: operation,
      submissionId: submissionId,
      name: name,
      email: email,
      phone: phone,
      topic: topic,
      message: message,
    };
  }

  if (operation === "newsletter") {
    const email = requiredText_(request.email, 254, "INVALID_EMAIL").toLowerCase();
    if (!isValidEmail_(email)) {
      throw new Error("INVALID_EMAIL");
    }
    if (request.consent !== true) {
      throw new Error("INVALID_CONSENT");
    }
    return {
      operation: operation,
      submissionId: submissionId,
      email: email,
      consent: true,
    };
  }

  const productId = requiredText_(request.productId, 120, "INVALID_PRODUCT");
  const productName = requiredText_(request.productName, 200, "INVALID_PRODUCT");
  const name = requiredText_(request.name, 100, "INVALID_NAME");
  const title = optionalText_(request.title, 120, "INVALID_TITLE");
  const comment = requiredText_(request.comment, 5000, "INVALID_MESSAGE");
  validateName_(name);
  if (!Number.isInteger(request.rating) || request.rating < 1 || request.rating > 5) {
    throw new Error("INVALID_RATING");
  }

  return {
    operation: operation,
    submissionId: submissionId,
    productId: productId,
    productName: productName,
    rating: request.rating,
    name: name,
    title: title,
    comment: comment,
  };
}

function requiredText_(value, maxLength, errorCode) {
  if (typeof value !== "string") {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  const text = value.trim();
  if (!text || text.length > maxLength) {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  return text;
}

function optionalText_(value, maxLength, errorCode) {
  if (typeof value !== "string") {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw new Error(errorCode || "INVALID_REQUEST");
  }
  return text;
}

function validateName_(value) {
  if (/[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error("INVALID_NAME");
  }
}

function validatePhone_(value) {
  const digits = value.replace(/\D/g, "").length;
  if (!/^[+()\d\s.-]{7,30}$/.test(value) || digits < 7 || digits > 15) {
    throw new Error("INVALID_PHONE");
  }
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getNotificationEmail_() {
  const email = PropertiesService.getScriptProperties()
    .getProperty("NOTIFICATION_EMAIL");
  if (!email || !isValidEmail_(email.trim())) {
    throw new Error("NOTIFICATION_NOT_CONFIGURED");
  }
  return email.trim();
}

function getOrCreateSheet_(spreadsheet, config) {
  const sheet =
    spreadsheet.getSheetByName(config.sheetName) ||
    spreadsheet.insertSheet(config.sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, config.headers.length)
    .getDisplayValues()[0];
  const isEmpty = existingHeaders.every(function (header) {
    return !header;
  });
  if (isEmpty && lastRow === 1) {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  const headersMatch = config.headers.every(function (header, index) {
    return existingHeaders[index] === header;
  });
  if (!headersMatch) {
    const legacyHeadersMatch =
      config.legacyHeaderCount &&
      config.headers.slice(0, config.legacyHeaderCount).every(function (header, index) {
        return existingHeaders[index] === header;
      });
    const addedHeadersAreEmpty =
      legacyHeadersMatch &&
      existingHeaders.slice(config.legacyHeaderCount).every(function (header) {
        return !header;
      });
    if (!addedHeadersAreEmpty) {
      throw new Error("SHEET_HEADERS_INVALID");
    }
    sheet
      .getRange(
        1,
        config.legacyHeaderCount + 1,
        1,
        config.headers.length - config.legacyHeaderCount,
      )
      .setValues([config.headers.slice(config.legacyHeaderCount)]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findSubmissionRow_(sheet, idColumn, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }
  const match = sheet
    .getRange(2, idColumn, lastRow - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : null;
}

function buildRow_(submission) {
  const values = [new Date()];
  if (submission.operation === "contact") {
    values.push(
      submission.name,
      submission.email,
      submission.phone,
      submission.topic,
      submission.message,
      "Pending",
      submission.submissionId,
      "Pending",
    );
  } else if (submission.operation === "newsletter") {
    values.push(submission.email, "Yes", submission.submissionId, "Pending");
  } else {
    values.push(
      submission.productId,
      submission.productName,
      submission.rating,
      submission.name,
      submission.title,
      submission.comment,
      "Pending",
    );
  }
  if (submission.operation === "review") {
    values.push(submission.submissionId);
  }
  return values;
}

function sendEmailIfNeeded_(sheet, rowNumber, statusColumn, sendEmail) {
  if (sheet.getRange(rowNumber, statusColumn).getDisplayValue() === "Sent") {
    return true;
  }

  try {
    sendEmail();
    sheet.getRange(rowNumber, statusColumn).setValue("Sent");
    return true;
  } catch (error) {
    sheet.getRange(rowNumber, statusColumn).setValue("Failed");
    return false;
  }
}

function sendContactNotification_(recipient, submission) {
  const body = [
    "A new contact enquiry was recorded.",
    "",
    "Name: " + submission.name,
    "Email: " + submission.email,
    "Phone: " + submission.phone,
    "Subject: " + submission.topic,
    "",
    "Message:",
    submission.message,
    "",
    "Submission ID: " + submission.submissionId,
  ].join("\n");
  MailApp.sendEmail({
    to: recipient,
    subject: "Contact enquiry: " + submission.topic,
    body: body,
    replyTo: submission.email,
    name: "OrganicandNutrition",
  });
}

function sendContactConfirmation_(replyAddress, submission) {
  const body = [
    "Hello " + submission.name + ",",
    "",
    "We have received your enquiry about: " + submission.topic,
    "Our team will review your message and get back to you.",
    "",
    "Your message:",
    submission.message,
    "",
    "If you need to add information, reply to this email.",
    "",
    "OrganicandNutrition",
  ].join("\n");
  MailApp.sendEmail({
    to: submission.email,
    subject: "We received your enquiry",
    body: body,
    replyTo: replyAddress,
    name: "OrganicandNutrition",
  });
}

function sendNewsletterConfirmation_(submission) {
  if (submission.consent !== true) {
    throw new Error("INVALID_CONSENT");
  }
  MailApp.sendEmail({
    to: submission.email,
    subject: "Your newsletter request was received",
    body: [
      "Thank you for requesting updates from OrganicandNutrition.",
      "",
      "This email only confirms that we received your request. It is not a marketing message.",
      "No marketing campaigns are sent automatically by this website.",
    ].join("\n"),
    name: "OrganicandNutrition",
  });
}

function sendReviewNotification_(recipient, submission) {
  let subject;
  let body;
  subject = "New HealthyNewLifestyle product review to moderate";
  body = [
    "A product review was received for moderation. It has not been published.",
    "",
    "Product: " + submission.productName,
    "Product ID: " + submission.productId,
    "Rating: " + submission.rating + "/5",
    "Name: " + submission.name,
    "Title: " + (submission.title || "Not provided"),
    "",
    "Review:",
    submission.comment,
    "",
    "Submission ID: " + submission.submissionId,
  ].join("\n");
  MailApp.sendEmail({ to: recipient, subject: subject, body: body });
}

function safeSheetValue_(value) {
  if (typeof value !== "string") {
    return value;
  }
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
