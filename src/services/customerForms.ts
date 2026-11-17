export type CustomerFormSubmission =
  | {
      operation: "contact";
      submissionId: string;
      name: string;
      email: string;
      phone: string;
      topic: string;
      message: string;
    }
  | {
      operation: "newsletter";
      submissionId: string;
      email: string;
      consent: true;
    }
  | {
      operation: "review";
      submissionId: string;
      productId: string;
      productName: string;
      rating: number;
      name: string;
      title: string;
      comment: string;
    };

type FormResponse = {
  success: true;
  duplicate: boolean;
  notificationSent?: boolean;
  adminNotificationSent?: boolean;
  customerConfirmationSent?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function submitCustomerForm(
  submission: CustomerFormSubmission,
): Promise<FormResponse> {
  let response: Response;
  try {
    response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
  } catch {
    throw new Error("The form service could not be reached. Please try again.");
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("The form service returned an invalid response. Please try again.");
  }

  if (!response.ok || !isRecord(result) || result.success !== true) {
    const message =
      isRecord(result) && typeof result.error === "string"
        ? result.error
        : "Your submission could not be saved. Please try again.";
    throw new Error(message);
  }

  return {
    success: true,
    duplicate: result.duplicate === true,
    ...(typeof result.adminNotificationSent === "boolean"
      ? { adminNotificationSent: result.adminNotificationSent }
      : {}),
    ...(typeof result.customerConfirmationSent === "boolean"
      ? { customerConfirmationSent: result.customerConfirmationSent }
      : {}),
    ...(typeof result.notificationSent === "boolean"
      ? { notificationSent: result.notificationSent }
      : {}),
  };
}
