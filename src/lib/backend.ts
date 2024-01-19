import { envVariables } from "./env";
import { createNamedLogger } from "./log";

const logger = createNamedLogger("backend");

export async function registerPushToken(pushToken: string) {
  const body = { expoPushToken: pushToken };

  let stringifiedBody: string;
  try {
    stringifiedBody = JSON.stringify(body);
  } catch (error) {
    logger.error("Body stringify failed", error);
    throw error;
  }

  try {
    await fetch(`${envVariables.backend.baseUrl}/api/push-tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: stringifiedBody,
    });
  } catch (error) {
    logger.error("Post push token failed", error);
    throw error;
  }
}
