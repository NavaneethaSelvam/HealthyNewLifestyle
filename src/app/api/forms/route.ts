import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16_384;
const MAX_MESSAGE_LENGTH = 5_000;

type ContactSubmission = {
  operation: "contact";
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

type NewsletterSubmission = {
  operation: "newsletter";
  submissionId: string;
  email: string;
  consent: true;
};

type ReviewSubmission = {
  operation: "review";
  submissionId: string;
  productId: string;
  productName: string;
  rating: number;
  name: string;
  title: string;
  comment: string;
};

type FormSubmission =
  | ContactSubmission
  | NewsletterSubmission
  | ReviewSubmission;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getText(
  input: Record<string, unknown>,
  key: string,
  maxLength: number,
): string | null {
  const value = input[key];
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
}

function getOptionalText(
  input: Record<string, unknown>,
  key: string,
  maxLength: number,
): string | null {
  const value = input[key];
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length <= maxLength ? normalized : null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidSubmissionId(value: string | null): value is string {
  return Boolean(value && /^[A-Za-z0-9-]{20,80}$/.test(value));
}

function isValidName(value: string): boolean {
  return !/[\u0000-\u001f\u007f]/.test(value);
}

function validateSubmission(
  input: unknown,
):
  | { success: true; submission: FormSubmission }
  | { success: false; error: string } {
  if (!isRecord(input)) {
    return { success: false, error: "The submitted form data is invalid." };
  }

  if (
    input.operation !== "contact" &&
    input.operation !== "newsletter" &&
    input.operation !== "review"
  ) {
    return { success: false, error: "Choose a valid form type." };
  }

  const submissionId = getText(input, "submissionId", 80);
  if (!isValidSubmissionId(submissionId)) {
    return { success: false, error: "The submission could not be verified. Please try again." };
  }

  if (input.operation === "contact") {
    const name = getText(input, "name", 100);
    const email = getText(input, "email", 254);
    const phone = getText(input, "phone", 30);
    const topic = getText(input, "topic", 120);
    const message = getText(input, "message", MAX_MESSAGE_LENGTH);
    const phoneDigits = phone?.replace(/\D/g, "").length ?? 0;
    const hasHeaderControlCharacters = Boolean(topic && /[\u0000-\u001f\u007f]/.test(topic));

    if (
      !name ||
      !isValidName(name) ||
      !email ||
      !isValidEmail(email) ||
      !phone ||
      !/^[+()\d\s.-]{7,30}$/.test(phone) ||
      phoneDigits < 7 ||
      phoneDigits > 15 ||
      !topic ||
      hasHeaderControlCharacters ||
      !message
    ) {
      return {
        success: false,
        error: "Enter a valid name, email, phone number, topic, and message.",
      };
    }

    return {
      success: true,
      submission: {
        operation: "contact",
        submissionId,
        name,
        email: email.toLowerCase(),
        phone,
        topic,
        message,
      },
    };
  }

  if (input.operation === "newsletter") {
    const email = getText(input, "email", 254);
    if (!email || !isValidEmail(email) || input.consent !== true) {
      return {
        success: false,
        error: "Enter a valid email address and confirm your subscription consent.",
      };
    }

    return {
      success: true,
      submission: {
        operation: "newsletter",
        submissionId,
        email: email.toLowerCase(),
        consent: true,
      },
    };
  }

  if (input.operation === "review") {
    const productId = getText(input, "productId", 120);
    const productName = getText(input, "productName", 200);
    const name = getText(input, "name", 100);
    const title = getOptionalText(input, "title", 120);
    const comment = getText(input, "comment", MAX_MESSAGE_LENGTH);
    const rating = input.rating;

    if (
      !productId ||
      !productName ||
      !name ||
      !isValidName(name) ||
      title === null ||
      !comment ||
      !Number.isInteger(rating) ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return {
        success: false,
        error: "Enter a valid product review and rating from 1 to 5.",
      };
    }

    return {
      success: true,
      submission: {
        operation: "review",
        submissionId,
        productId,
        productName,
        rating,
        name,
        title,
        comment,
      },
    };
  }

  return { success: false, error: "Choose a valid form type." };
}

function responseError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return responseError("The submitted form is too large.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return responseError("The submitted form data is not valid JSON.", 400);
  }

  if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
    return responseError("The submitted form is too large.", 413);
  }

  const validation = validateSubmission(body);
  if (!validation.success) {
    return responseError(validation.error, 400);
  }

  const deploymentUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET?.trim();
  if (!deploymentUrl || !sharedSecret) {
    return responseError(
      "Online form submissions are not configured yet. Please contact OrganicandNutrition directly.",
      503,
    );
  }

  let endpoint: URL;
  try {
    endpoint = new URL(deploymentUrl);
  } catch {
    return responseError("The enquiry service URL is invalid.", 503);
  }

  if (
    endpoint.protocol !== "https:" ||
    endpoint.hostname !== "script.google.com" ||
    !/^\/macros\/s\/[^/]+\/exec\/?$/.test(endpoint.pathname)
  ) {
    return responseError("The enquiry service URL is invalid.", 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validation.submission,
        apiKey: sharedSecret,
      }),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
    const responseText = await upstream.text();
    if (responseText.length > 8_192) {
      return responseError("The enquiry service returned an invalid response.", 502);
    }

    let result: unknown;
    try {
      result = JSON.parse(responseText);
    } catch {
      return responseError(
        "The enquiry service returned an invalid response. Check its deployment settings.",
        502,
      );
    }

    if (!upstream.ok || !isRecord(result) || result.success !== true) {
      const message =
        isRecord(result) && typeof result.error === "string"
          ? result.error
          : "The enquiry service could not save your details. Please try again.";
      return responseError(message, 502);
    }

    return NextResponse.json({
      success: true,
      duplicate: result.duplicate === true,
      ...(validation.submission.operation === "contact"
        ? {
            adminNotificationSent: result.adminNotificationSent === true,
            customerConfirmationSent: result.customerConfirmationSent === true,
          }
        : validation.submission.operation === "newsletter"
          ? {
              customerConfirmationSent:
                result.customerConfirmationSent === true,
            }
          : { notificationSent: result.notificationSent === true }),
    });
  } catch {
    return responseError(
      controller.signal.aborted
        ? "The enquiry service timed out. Please try again."
        : "The enquiry service could not be reached. Please try again.",
      controller.signal.aborted ? 504 : 502,
    );
  } finally {
    clearTimeout(timeout);
  }
}
