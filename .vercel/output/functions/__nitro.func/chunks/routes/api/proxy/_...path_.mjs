import { d as defineEventHandler, g as getMethod, s as setHeader, a as getRouterParams, b as getRequestHeaders, c as getQuery, p as proxyRequest, e as sendProxy, r as readBody } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';

const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";
const GROUP_API_BASE_URL = process.env.NUXT_PUBLIC_GROUP_API_URL || "http://localhost:8082/api";
const NOTIFICATION_API_BASE_URL = process.env.NUXT_PUBLIC_NOTIFICATION_API_URL || "http://localhost:8083/api";
const FILE_SERVICE_BASE_URL = process.env.NUXT_PUBLIC_FILE_SERVICE_URL || "http://localhost:8084";
const PRESENCE_SERVICE_BASE_URL = process.env.NUXT_PUBLIC_PRESENCE_SERVICE_URL || "http://localhost:8085/api";
const ensureValidUrl = (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `http://${url}`;
  }
  return url.replace(/([^:]\/)\/+/g, "$1");
};
const setCorsHeaders = (event) => {
  setHeader(event, "Access-Control-Allow-Origin", "*");
  setHeader(
    event,
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  setHeader(
    event,
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  setHeader(event, "Access-Control-Allow-Credentials", "true");
};
const validateToken = (token) => {
  if (!token) {
    console.error("[Server Proxy] No token provided");
    return false;
  }
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) {
      console.warn("[Server Proxy] Token does not have standard JWT structure");
      return true;
    }
    try {
      const decoded = Buffer.from(payload, "base64").toString();
      const decodedPayload = JSON.parse(decoded);
      if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1e3) {
        console.warn(
          "[Server Proxy] Token may be expired, but proceeding anyway"
        );
        return true;
      }
    } catch (decodeError) {
      console.warn(
        "[Server Proxy] Could not decode token payload, but proceeding with request"
      );
      return true;
    }
    return true;
  } catch (error) {
    console.error("[Server Proxy] Token validation error:", error);
    return true;
  }
};
const ____path_ = defineEventHandler(async (event) => {
  try {
    setCorsHeaders(event);
    const method = getMethod(event);
    if (method === "OPTIONS") {
      console.log("[Server Proxy] Handling CORS preflight request");
      setHeader(event, "Access-Control-Max-Age", 86400);
      return new Response(null, { status: 200 });
    }
    let forcedMethod = method;
    const params = getRouterParams(event);
    const pathArray = Array.isArray(params.path) ? params.path : [params.path];
    let pathString = pathArray.join("/");
    console.log(`[Server Proxy] Raw params:`, params);
    console.log(`[Server Proxy] Path array:`, pathArray);
    console.log(`[Server Proxy] Path string:`, pathString);
    if (pathString.startsWith("api/proxy/")) {
      pathString = pathString.substring(10);
      console.log(`[Server Proxy] Cleaned path string:`, pathString);
    } else if (pathString.startsWith("proxy/")) {
      pathString = pathString.substring(6);
      console.log(`[Server Proxy] Cleaned path string:`, pathString);
    }
    if (pathArray.join("/").includes("friends/add")) {
      console.log(
        "[Server Proxy] Forcing POST method for /friends/add endpoint"
      );
      forcedMethod = "POST";
    }
    const requestHeaders = getRequestHeaders(event);
    if (pathString === "users/profile/avatar") {
      console.log(
        "[Server Proxy] Profile avatar endpoint detected, using PUT method"
      );
      console.log(
        `[Server Proxy] Original method: ${method}, Content-Type: ${requestHeaders["content-type"] || "none"}`
      );
    }
    console.log(
      `[Server Proxy] Received ${method} request for path:`,
      pathString
    );
    const query = getQuery(event);
    const isAuthEndpoint = pathString === "auth/login" || pathString === "login" || pathString === "auth/register" || pathString === "register";
    if (isAuthEndpoint) {
      console.log(
        `[Server Proxy] Auth endpoint detected: ${pathString} - will skip token validation`
      );
    }
    let baseUrl = API_BASE_URL;
    let isFileRequest = false;
    let isWebSocketRequest = false;
    if (pathString.startsWith("notifications")) {
      baseUrl = NOTIFICATION_API_BASE_URL;
      console.log(
        `[Server Proxy] Routing to NOTIFICATION_API_BASE_URL: ${baseUrl}`
      );
    } else if (pathString.startsWith("presence")) {
      baseUrl = PRESENCE_SERVICE_BASE_URL;
      console.log(
        `[Server Proxy] Routing to PRESENCE_SERVICE_BASE_URL: ${baseUrl}`
      );
      if (pathString.startsWith("presence/users") && Object.keys(query).length > 0) {
        console.log(
          `[Server Proxy] Special handling for presence/users endpoint with query params`
        );
        console.log(`[Server Proxy] Query parameters:`, query);
        if (query.user_ids) {
          console.log(`[Server Proxy] User IDs parameter: ${query.user_ids}`);
          try {
            console.log(`[Server Proxy] Presence user_ids detailed info:`, {
              rawValue: query.user_ids,
              type: typeof query.user_ids,
              containsComma: String(query.user_ids).includes(","),
              length: String(query.user_ids).length
            });
            if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
              baseUrl = `http://${baseUrl}`;
              console.log(
                `[Server Proxy] Added protocol to presence service URL: ${baseUrl}`
              );
            }
          } catch (error) {
            console.error(
              `[Server Proxy] Error processing presence user_ids:`,
              error
            );
          }
        }
      }
    } else if (pathString.startsWith("messages") || pathString.startsWith("groups/messages") || pathString.startsWith("group/") && pathString.includes("/messages")) {
      baseUrl = GROUP_API_BASE_URL;
      console.log(
        `[Server Proxy] MESSAGES ROUTING: Setting baseUrl to ${baseUrl} for path: ${pathString}`
      );
      if (pathString === "messages/history") {
        console.log(
          `[Server Proxy] Special handling for messages/history endpoint`
        );
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
          baseUrl = `http://${baseUrl}`;
        }
      } else if (pathString.startsWith("messages/") && method === "DELETE") {
        const parts = pathString.split("/");
        const messageId = parts.length > 1 ? parts[1] : null;
        console.log(`[Server Proxy] Handling message deletion: ${messageId}`);
        const isGroupMessage = query.type === "group" || query.group_id;
        const groupId = query.group_id || null;
        console.log(`[Server Proxy] Message DELETE operation:`, {
          messageId,
          originalPath: pathString,
          isGroupMessage,
          groupId,
          method
        });
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
          baseUrl = `http://${baseUrl}`;
        }
        if (baseUrl !== GROUP_API_BASE_URL) {
          console.log(
            `[Server Proxy] Setting base URL to GROUP_API_BASE_URL for message deletion`
          );
          baseUrl = GROUP_API_BASE_URL;
          if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
            baseUrl = `http://${baseUrl}`;
          }
        }
        console.log(
          `[Server Proxy] Will route message deletion to: ${baseUrl}/messages/${messageId}`
        );
      }
      if (pathString.startsWith("groups/")) {
        pathString = pathString.replace("groups/", "");
        console.log(
          `[Server Proxy] MESSAGES ROUTING: Cleaned groups prefix, new path: ${pathString}`
        );
      }
      console.log(`[Server Proxy] Routing to MESSAGE_API_BASE_URL: ${baseUrl}`);
    } else if (pathString.startsWith("groups") || pathString.startsWith("group")) {
      baseUrl = ensureValidUrl(GROUP_API_BASE_URL);
      console.log(`[Server Proxy] Routing to GROUP_API_BASE_URL: ${baseUrl}`);
      console.log(`[Server Proxy] GROUP REQUEST DETAILS:`);
      console.log(`[Server Proxy] - Original path: ${pathString}`);
      console.log(`[Server Proxy] - Base URL: ${baseUrl}`);
      console.log(`[Server Proxy] - Query params:`, query);
    } else if (pathString.startsWith("files") || pathString.startsWith("media")) {
      baseUrl = FILE_SERVICE_BASE_URL;
      isFileRequest = true;
      console.log(
        `[Server Proxy] Routing to FILE_SERVICE_BASE_URL: ${baseUrl} for path: ${pathString}`
      );
    }
    isWebSocketRequest = !!(requestHeaders.connection?.toLowerCase().includes("upgrade") && requestHeaders.upgrade?.toLowerCase() === "websocket");
    if (isWebSocketRequest) {
      console.log("[Server Proxy] WebSocket connection request detected");
      let wsTarget = "";
      if (pathString.startsWith("messages/ws")) {
        wsTarget = "ws://localhost:8082/api/messages/ws";
        console.log(
          "[Server Proxy] Routing WebSocket to MESSAGES service on port 8082"
        );
      } else if (pathString.startsWith("presence/ws")) {
        wsTarget = "ws://localhost:8085/api/presence/ws";
        console.log(
          "[Server Proxy] Routing WebSocket to PRESENCE service on port 8085"
        );
      }
      if (wsTarget) {
        const targetUrl = new URL(wsTarget);
        if (Object.keys(query).length > 0) {
          for (const [key, value] of Object.entries(query)) {
            targetUrl.searchParams.append(key, value);
          }
        }
        console.log(
          `[Server Proxy] Proxying WebSocket to: ${targetUrl.toString()}`
        );
        let token = query.token;
        if (!token && requestHeaders.cookie) {
          const cookieStr = requestHeaders.cookie;
          const cookies = cookieStr.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
          }, {});
          token = cookies.auth_token;
        }
        try {
          return proxyRequest(event, targetUrl.toString(), {
            // Forward essential headers for WebSocket
            headers: {
              // Include upgrade and connection headers explicitly
              Upgrade: "websocket",
              Connection: "Upgrade",
              // Forward Authorization header if we have a token
              ...token ? { Authorization: `Bearer ${token}` } : {},
              // Include other headers that might be needed
              ...requestHeaders.origin ? { Origin: requestHeaders.origin } : {},
              ...requestHeaders["sec-websocket-key"] ? { "Sec-WebSocket-Key": requestHeaders["sec-websocket-key"] } : {},
              ...requestHeaders["sec-websocket-version"] ? {
                "Sec-WebSocket-Version": requestHeaders["sec-websocket-version"]
              } : {},
              ...requestHeaders["sec-websocket-extensions"] ? {
                "Sec-WebSocket-Extensions": requestHeaders["sec-websocket-extensions"]
              } : {}
            }
            // Additional proxy options for better error handling
            // Remove the fetch with timeout property since it's not supported
          });
        } catch (error) {
          console.error(
            `[Server Proxy] WebSocket proxy error: ${error instanceof Error ? error.message : "Unknown error"}`
          );
          return {
            error: true,
            message: "Failed to establish WebSocket connection"
          };
        }
      }
    }
    if (pathString.includes("presence/ws")) {
      console.log(
        "[Server Proxy] Handling WebSocket upgrade request for presence service"
      );
      const token = query.token;
      if (!token) {
        throw new Error("No token provided for WebSocket connection");
      }
      const wsUrl = `ws://localhost:8085/presence/ws?token=${token}`;
      console.log("[Server Proxy] WebSocket target URL:", wsUrl);
      return { wsUrl };
    }
    let url;
    if (pathString === "messages/history") {
      const baseWithProtocol = baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`;
      url = `${baseWithProtocol}/messages/history`;
      console.log(
        `[Server Proxy] Special URL construction for messages/history: ${url}`
      );
    } else if (pathString.startsWith("presence/users")) {
      const baseWithProtocol = baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`;
      url = `${baseWithProtocol}/presence/users`;
      console.log(
        `[Server Proxy] Special URL construction for presence/users: ${url}`
      );
      if (query.user_ids) {
        console.log(
          `[Server Proxy] Processing presence user_ids: ${query.user_ids}`
        );
        const userIdsValue = query.user_ids;
        if (userIdsValue.includes(",")) {
          console.log(`[Server Proxy] Detected comma-separated user IDs`);
          try {
            const idParts = userIdsValue.split(",");
            const encodedIds = idParts.map((id) => encodeURIComponent(id.trim())).join(",");
            url = `${url}?user_ids=${encodedIds}`;
            console.log(
              `[Server Proxy] Constructed presence URL with encoded IDs: ${url}`
            );
          } catch (encodeError) {
            console.error(
              `[Server Proxy] Error encoding user_ids:`,
              encodeError
            );
            const presenceParams = new URLSearchParams();
            presenceParams.append("user_ids", userIdsValue);
            url = `${url}?${presenceParams.toString()}`;
            console.log(`[Server Proxy] Fallback presence URL: ${url}`);
          }
        } else {
          const presenceParams = new URLSearchParams();
          presenceParams.append("user_ids", userIdsValue);
          url = `${url}?${presenceParams.toString()}`;
          console.log(`[Server Proxy] Added user_ids to presence URL: ${url}`);
        }
      }
    } else if (pathString.startsWith("messages/") && pathString.split("/").length >= 2 && method === "DELETE") {
      const parts = pathString.split("/");
      const messageId = parts[1];
      const baseWithProtocol = baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`;
      url = `${baseWithProtocol}/messages/${messageId}`;
      console.log(
        `[Server Proxy] Special URL construction for message deletion: ${url}`
      );
    } else if (pathString.startsWith("presence/")) {
      const baseWithProtocol = baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`;
      const presencePath = pathString.substring("presence/".length);
      url = `${baseWithProtocol}/${pathString}`;
      console.log(
        `[Server Proxy] Special URL construction for presence endpoint: ${url}`
      );
      if (presencePath.startsWith("users") && Object.keys(query).length > 0) {
        console.log(
          `[Server Proxy] Handling presence/users with query parameters`
        );
      }
    } else if (isFileRequest) {
      if (pathString.startsWith("files/")) {
        const filePath = pathString.substring(6);
        url = `${baseUrl}/api/files/${filePath}`;
      } else if (pathString.startsWith("media/")) {
        const mediaPath = pathString.substring(6);
        url = `${baseUrl}/api/media/${mediaPath}`;
      } else if (pathString === "files") {
        url = `${baseUrl}/api/files`;
      } else if (pathString === "media") {
        url = `${baseUrl}/api/media`;
      } else {
        url = `${baseUrl}/api/${pathString}`;
      }
      console.log(`[Server Proxy] File service URL constructed: ${url}`);
    } else if (pathString.startsWith("presence")) {
      url = `${baseUrl}/${pathString}`;
      console.log(`[Server Proxy] Routing presence request to: ${url}`);
    } else if (pathString.startsWith("notifications")) {
      url = `${baseUrl}/${pathString}`;
      console.log(`[Server Proxy] Routing notification request to: ${url}`);
    } else if (pathString.startsWith("groups") || pathString.startsWith("group")) {
      const baseWithProtocol = baseUrl.startsWith("http://") || baseUrl.startsWith("https://") ? baseUrl : `http://${baseUrl}`;
      url = `${baseWithProtocol}/${pathString}`;
      try {
        new URL(url);
        console.log(`[Server Proxy] Valid group URL constructed: ${url}`);
      } catch (error) {
        console.error(`[Server Proxy] Invalid group URL detected: ${url}`);
        url = ensureValidUrl(`${baseWithProtocol}/${pathString}`);
        console.log(`[Server Proxy] Corrected group URL: ${url}`);
      }
    } else {
      const baseWithProtocol = baseUrl.startsWith("http://") || baseUrl.startsWith("https://") ? baseUrl : `http://${baseUrl}`;
      url = `${baseWithProtocol}/${pathString}`;
      console.log(
        `[Server Proxy] Generic URL construction: baseUrl=${baseUrl}, pathString=${pathString}, final URL=${url}`
      );
    }
    const alreadyHasQueryParams = url.includes("?");
    if (!alreadyHasQueryParams) {
      const queryString = new URLSearchParams(
        query
      ).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    console.log(`[Server Proxy] Forwarding to: ${url}`);
    if (pathString.includes("media")) {
      console.log(`[Server Proxy] MEDIA REQUEST DETAILS:`);
      console.log(`[Server Proxy] - Original path string: ${pathString}`);
      console.log(`[Server Proxy] - Base URL: ${baseUrl}`);
      console.log(`[Server Proxy] - Final URL: ${url}`);
      console.log(`[Server Proxy] - Method: ${forcedMethod}`);
    }
    if (pathString.includes("messages/history")) {
      console.log(`[Server Proxy] MESSAGES/HISTORY REQUEST DETAILS:`);
      console.log(`[Server Proxy] - Base URL: ${baseUrl}`);
      console.log(`[Server Proxy] - Path: ${pathString}`);
      console.log(`[Server Proxy] - Query params:`, query);
      console.log(`[Server Proxy] - Final URL before validation: ${url}`);
      console.log(`[Server Proxy] - Method: ${forcedMethod}`);
      try {
        new URL(url);
      } catch (error) {
        console.error(
          `[Server Proxy] Invalid URL for messages/history: ${url}`
        );
        let fixedUrl = url;
        if (!fixedUrl.startsWith("http://") && !fixedUrl.startsWith("https://")) {
          fixedUrl = `http://${fixedUrl}`;
        }
        fixedUrl = fixedUrl.replace(/([^:]\/)\/+/g, "$1");
        url = fixedUrl;
        console.log(`[Server Proxy] Fixed messages/history URL: ${url}`);
      }
    }
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const options = {
      method: forcedMethod,
      headers,
      credentials: "include"
      // For CORS
    };
    if (requestHeaders.authorization) {
      console.log("[Server Proxy] Forwarding Authorization header");
      const token = requestHeaders.authorization.startsWith("Bearer ") ? requestHeaders.authorization : `Bearer ${requestHeaders.authorization}`;
      headers["Authorization"] = token;
      if (pathString.startsWith("notifications")) {
        console.log(
          "[Server Proxy] Using Bearer format for notifications service"
        );
      } else {
        console.log(
          "[Server Proxy] Formatted token with 'Bearer' prefix for standard API"
        );
      }
    } else if (requestHeaders.cookie && !isAuthEndpoint) {
      console.log("[Server Proxy] Checking cookies for auth token");
      const cookieStr = requestHeaders.cookie;
      const cookies = cookieStr.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});
      if (cookies.auth_token) {
        console.log("[Server Proxy] Found auth_token in cookies");
        headers["Authorization"] = `Bearer ${cookies.auth_token}`;
        console.log("[Server Proxy] Added Bearer prefix to auth_token");
      } else {
        console.log("[Server Proxy] No auth_token found in cookies");
      }
    } else {
      if (isAuthEndpoint) {
        console.log(
          "[Server Proxy] Auth endpoint detected - skipping token extraction"
        );
      } else {
        console.log("[Server Proxy] No authentication credentials found");
      }
    }
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (requestHeaders["content-type"]?.includes("multipart/form-data")) {
        console.log(
          `[Server Proxy] File upload detected using method ${method}, path: ${pathString}, using special handling`
        );
        try {
          const targetUrl = new URL(url);
          console.log(
            "[Server Proxy] Authorization header:",
            headers.Authorization
          );
          const proxyHeaders = {};
          if (headers.Authorization) {
            proxyHeaders.Authorization = headers.Authorization;
            console.log(
              "[Server Proxy] Added Authorization header:",
              proxyHeaders.Authorization
            );
          } else if (requestHeaders.authorization) {
            proxyHeaders.Authorization = requestHeaders.authorization.startsWith("Bearer ") ? requestHeaders.authorization : `Bearer ${requestHeaders.authorization}`;
            console.log(
              "[Server Proxy] Added Authorization from request headers:",
              proxyHeaders.Authorization
            );
          } else if (requestHeaders.cookie) {
            const cookieStr = requestHeaders.cookie;
            const cookies = cookieStr.split(";").reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split("=");
              acc[key] = value;
              return acc;
            }, {});
            if (cookies.auth_token) {
              proxyHeaders.Authorization = `Bearer ${cookies.auth_token}`;
              console.log(
                "[Server Proxy] Added Authorization from cookies:",
                proxyHeaders.Authorization
              );
            }
          }
          Object.entries(requestHeaders).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== "content-type" && lowerKey !== "content-length" && lowerKey !== "authorization") {
              if (value !== void 0) {
                proxyHeaders[key] = value.toString();
              }
            }
          });
          return sendProxy(event, targetUrl.toString(), {
            // Forward necessary headers but NOT content-type (browser will set it with proper boundary)
            headers: proxyHeaders
          });
        } catch (error) {
          console.error("[Server Proxy] Error proxying file upload:", error);
          throw new Error("Failed to proxy file upload");
        }
      } else {
        try {
          const body = await readBody(event);
          if (body !== void 0 && body !== null) {
            options.body = JSON.stringify(body);
            if (isAuthEndpoint && body.email) {
              console.log("[Server Proxy] Request body:", {
                ...body,
                password: body.password ? "********" : void 0
              });
              if (body.email.includes("@gmail.coma")) {
                console.warn(
                  "[Server Proxy] WARNING: Email contains typo - @gmail.coma instead of @gmail.com"
                );
              } else if (body.email.endsWith(".coma")) {
                console.warn(
                  "[Server Proxy] WARNING: Email contains typo - domain ends with .coma instead of .com"
                );
              } else if (body.email.includes(".con")) {
                console.warn(
                  "[Server Proxy] WARNING: Email contains typo - .con instead of .com"
                );
              }
            }
          }
        } catch (error) {
          console.error("[Server Proxy] Error reading JSON body:", error);
          throw new Error("Failed to process request body");
        }
      }
    } else {
      console.log(`[Server Proxy] Skipping body parsing for ${method} request`);
    }
    if (!isAuthEndpoint) {
      const authHeader = headers["Authorization"];
      const token = authHeader?.replace("Bearer ", "");
      if (!validateToken(token)) {
        console.error(
          "[Server Proxy] Token validation failed with token:",
          token ? `${token.substring(0, 10)}...` : "undefined"
        );
        console.error(
          "[Server Proxy] Proceeding with request despite invalid token"
        );
      } else {
        console.log("[Server Proxy] Token validation successful");
      }
    } else {
      console.log("[Server Proxy] Skipping token validation for auth endpoint");
    }
    try {
      new URL(url);
      console.log(`[Server Proxy] URL validation successful: ${url}`);
    } catch (error) {
      console.error(`[Server Proxy] Invalid URL detected: ${url}`);
      throw new Error(`Cannot create a valid URL: ${url}`);
    }
    console.log(`[Server Proxy] Making ${options.method} request to: ${url}`);
    console.log(`[Server Proxy] Headers:`, headers);
    const response = await fetch(url, options);
    console.log(
      `[Server Proxy] Backend response status: ${response.status} from ${url}`
    );
    if (!response.ok) {
      console.error(
        `[Server Proxy] Error from backend: ${response.status} ${response.statusText}`
      );
      let errorBody;
      try {
        const contentType2 = response.headers.get("content-type");
        console.log("[Server Proxy] Error response content type:", contentType2);
        if (contentType2 && contentType2.includes("application/json")) {
          errorBody = await response.json();
          console.log(
            "[Server Proxy] Detailed error from backend:",
            JSON.stringify(errorBody, null, 2)
          );
        } else {
          errorBody = await response.text();
          console.log("[Server Proxy] Error text from backend:", errorBody);
        }
      } catch (e) {
        console.error("[Server Proxy] Error parsing error response:", e);
        errorBody = "Error parsing response";
      }
      event.node.res.statusCode = response.status;
      if (typeof errorBody === "string") {
        return {
          error: true,
          message: errorBody,
          status: response.status,
          statusText: response.statusText
        };
      }
      return {
        ...errorBody,
        status: response.status,
        statusText: response.statusText
      };
    }
    const contentType = response.headers.get("content-type");
    const isFileDownload = isFileRequest && pathString.includes("/files/") && method === "GET" && contentType && !contentType.includes("application/json");
    if (isFileDownload) {
      console.log(
        `[Server Proxy] File download detected (${contentType}), streaming response`
      );
      for (const [key, value] of response.headers.entries()) {
        event.node.res.setHeader(key, value);
      }
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
    let responseData;
    try {
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
    } catch (e) {
      console.error("[Server Proxy] Error parsing response:", e);
      responseData = { error: "Failed to parse response" };
    }
    return responseData;
  } catch (error) {
    console.error("[Server Proxy] Error:", error.message);
    return {
      error: "Proxy Error",
      message: error.message,
      stack: void 0
    };
  }
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
