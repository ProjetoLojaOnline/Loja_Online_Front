export const UNEXPECTED_ERROR_MESSAGE = "Unexpected error. Please try again.";

export async function parseBackendError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? UNEXPECTED_ERROR_MESSAGE;
  } catch {
    return UNEXPECTED_ERROR_MESSAGE;
  }
}
