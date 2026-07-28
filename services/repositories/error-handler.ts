import { FirebaseError } from "firebase/app";

export class RepositoryError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

export function handleFirestoreError(error: unknown, context: string): never {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        throw new RepositoryError(
          "PERMISSION_DENIED",
          `Permission denied while ${context}. User may be unauthenticated or lacks access.`,
          error
        );
      case "not-found":
        throw new RepositoryError(
          "NOT_FOUND",
          `Document not found while ${context}.`,
          error
        );
      case "unavailable":
        throw new RepositoryError(
          "NETWORK_UNAVAILABLE",
          `Network unavailable. Could not complete ${context}.`,
          error
        );
      default:
        throw new RepositoryError(
          "FIRESTORE_ERROR",
          `Firestore error [${error.code}] while ${context}: ${error.message}`,
          error
        );
    }
  }

  throw new RepositoryError(
    "UNKNOWN_ERROR",
    `An unknown error occurred while ${context}.`,
    error
  );
}
