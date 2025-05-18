import { defineEventHandler, getRouterParams, readBody, sendProxy } from "h3";
import { getMethod, getQuery, getRequestHeaders } from "h3";
import { createServer } from "node:http";
import { proxyRequest } from "h3";

// Define a more complete RequestInit type to include duplex
interface EnhancedRequestInit extends RequestInit {
  duplex?: "half";
}

// Base URLs for different services
const API_BASE_URL = "http://localhost:8081/api";
const GROUP_API_BASE_URL = "http://localhost:8082/api";
const NOTIFICATION_API_BASE_URL = "http://localhost:8083/api";
const FILE_SERVICE_BASE_URL = "http://localhost:8084"; // File service base URL
const PRESENCE_SERVICE_BASE_URL = "http://localhost:8085/api"; // Presence service base URL

export default defineEventHandler(async (event) => {
  try {
    // Get HTTP method
    const method = getMethod(event);

    // Force POST method for certain endpoints
    let forcedMethod = method;
    const params = getRouterParams(event);
    const pathArray = Array.isArray(params.path) ? params.path : [params.path];
    const pathString = pathArray.join("/");

    if (pathArray.join("/").includes("friends/add")) {
      console.log(
        "[Server Proxy] Forcing POST method for /friends/add endpoint"
      );
      forcedMethod = "POST";
    }

    console.log(
      `[Server Proxy] Received ${method} request for path:`,
      pathString
    );

    // Get query parameters
    const query = getQuery(event);

    // Get request headers to forward auth headers
    const requestHeaders = getRequestHeaders(event);

    // Determine which API to route to
    let baseUrl = API_BASE_URL;
    let isFileRequest = false;
    let isWebSocketRequest = false;

    // Check if this is a WebSocket upgrade request
    isWebSocketRequest =
      requestHeaders.connection?.toLowerCase().includes("upgrade") &&
      requestHeaders.upgrade?.toLowerCase() === "websocket";

    if (isWebSocketRequest) {
      console.log("[Server Proxy] WebSocket connection request detected");

      // Determine the WebSocket service to connect to based on path
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
        // For WebSocket connections, use h3's built-in proxy functionality to handle the upgrade
        const targetUrl = new URL(wsTarget);

        // Add query parameters if present
        if (Object.keys(query).length > 0) {
          for (const [key, value] of Object.entries(query)) {
            targetUrl.searchParams.append(key, value as string);
          }
        }

        console.log(
          `[Server Proxy] Proxying WebSocket to: ${targetUrl.toString()}`
        );

        // Extract token from query or cookies for Authorization
        let token = query.token as string;
        if (!token && requestHeaders.cookie) {
          const cookieStr = requestHeaders.cookie;
          const cookies = cookieStr.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          token = cookies.auth_token;
        }

        try {
          // Use proxyRequest from h3 which handles WebSocket upgrades properly
          return proxyRequest(event, targetUrl.toString(), {
            // Forward essential headers for WebSocket
            headers: {
              // Include upgrade and connection headers explicitly
              Upgrade: "websocket",
              Connection: "Upgrade",
              // Forward Authorization header if we have a token
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              // Include other headers that might be needed
              ...(requestHeaders.origin
                ? { Origin: requestHeaders.origin }
                : {}),
              ...(requestHeaders["sec-websocket-key"]
                ? { "Sec-WebSocket-Key": requestHeaders["sec-websocket-key"] }
                : {}),
              ...(requestHeaders["sec-websocket-version"]
                ? {
                    "Sec-WebSocket-Version":
                      requestHeaders["sec-websocket-version"],
                  }
                : {}),
              ...(requestHeaders["sec-websocket-extensions"]
                ? {
                    "Sec-WebSocket-Extensions":
                      requestHeaders["sec-websocket-extensions"],
                  }
                : {}),
            },
            // Additional proxy options for better error handling
            fetch: {
              // Increase timeout for WebSocket connections
              timeout: 30000,
            },
          });
        } catch (error) {
          console.error(
            `[Server Proxy] WebSocket proxy error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          return {
            error: true,
            message: "Failed to establish WebSocket connection",
          };
        }
      }
    }

    // Continue with normal HTTP request handling
    if (pathString.startsWith("files-service")) {
      // Handle file service requests
      baseUrl = FILE_SERVICE_BASE_URL;
      // Remove the files-service prefix from the path
      pathArray.shift(); // Remove 'files-service'
      isFileRequest = true;
      console.log("[Server Proxy] Routing to FILES service on port 8084");
    } else if (
      pathString.startsWith("groups") ||
      pathString.includes("/groups") ||
      pathString.startsWith("messages") // Menambahkan kondisi untuk messages
    ) {
      baseUrl = GROUP_API_BASE_URL;
      console.log("[Server Proxy] Routing to GROUPS service on port 8082");
    } else if (pathString.startsWith("notifications")) {
      baseUrl = NOTIFICATION_API_BASE_URL;
      console.log(
        "[Server Proxy] Routing to NOTIFICATIONS service on port 8083"
      );
    } else if (pathString.startsWith("presence")) {
      baseUrl = PRESENCE_SERVICE_BASE_URL;
      console.log("[Server Proxy] Routing to PRESENCE service on port 8085");
    } else {
      console.log("[Server Proxy] Routing to default API service on port 8081");
    }

    // Build target URL - special handling for file service
    let url;
    if (isFileRequest) {
      url = `${baseUrl}/${pathArray.join("/")}`;
    } else {
      url = `${baseUrl}/${pathString}`;
    }

    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    console.log(`[Server Proxy] Forwarding to: ${url}`);

    // Build headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Create request options object
    const options: EnhancedRequestInit = {
      method: forcedMethod,
      headers,
      credentials: "include", // For CORS
    };

    // Forward authorization header if present
    if (requestHeaders.authorization) {
      console.log("[Server Proxy] Forwarding Authorization header");

      // Keep the Bearer prefix for notifications service (standard OAuth format)
      if (pathString.startsWith("notifications")) {
        // Ensure the token has the Bearer prefix
        const token = requestHeaders.authorization.startsWith("Bearer ")
          ? requestHeaders.authorization
          : `Bearer ${requestHeaders.authorization}`;

        headers["Authorization"] = token;
        console.log(
          "[Server Proxy] Using Bearer format for notifications service"
        );
      } else {
        // Ensure the token has the Bearer prefix for other services
        const token = requestHeaders.authorization.startsWith("Bearer ")
          ? requestHeaders.authorization
          : `Bearer ${requestHeaders.authorization}`;

        headers["Authorization"] = token;
        console.log(
          "[Server Proxy] Formatted token with 'Bearer' prefix for standard API"
        );
      }
    } else if (requestHeaders.cookie) {
      // Try to extract token from cookies if no authorization header
      console.log("[Server Proxy] Checking cookies for auth token");
      const cookieStr = requestHeaders.cookie;
      const cookies = cookieStr.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      if (cookies.auth_token) {
        console.log("[Server Proxy] Found auth_token in cookies");

        // Use Bearer prefix for all services including notifications
        headers["Authorization"] = `Bearer ${cookies.auth_token}`;
        console.log("[Server Proxy] Added Bearer prefix to auth_token");
      } else {
        console.log("[Server Proxy] No auth_token found in cookies");
      }
    } else {
      console.log("[Server Proxy] No authentication credentials found");
    }

    // Handle request body based on HTTP method and content type
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (requestHeaders["content-type"]?.includes("multipart/form-data")) {
        // Remove content type for multipart/form-data to let the browser set it with the boundary
        delete headers["Content-Type"];
        headers["content-type"] = requestHeaders["content-type"];
        console.log(
          "[Server Proxy] File upload detected, preserving original content-type"
        );

        try {
          // For multipart/form-data, use the raw body from the event
          const rawBody = await readBody(event);
          options.body = rawBody;
          console.log("[Server Proxy] Processing multipart form data");
        } catch (error) {
          console.error(
            "[Server Proxy] Error processing multipart/form-data:",
            error
          );
          throw new Error("Failed to process file upload");
        }
      } else {
        // Regular JSON handling for methods that have a body
        try {
          const body = await readBody(event);
          if (body !== undefined && body !== null) {
            options.body = JSON.stringify(body);
          }
        } catch (error) {
          console.error("[Server Proxy] Error reading JSON body:", error);
          throw new Error("Failed to process request body");
        }
      }
    } else {
      // For GET, HEAD, OPTIONS methods - don't try to read the body
      console.log(`[Server Proxy] Skipping body parsing for ${method} request`);
    }

    // Make the request to the backend API
    const response = await fetch(url, options);

    console.log(`[Server Proxy] Backend response status: ${response.status}`);

    // Handle error responses by returning status code and message
    if (!response.ok) {
      console.error(
        `[Server Proxy] Error from backend: ${response.status} ${response.statusText}`
      );

      // Try to get error details
      let errorBody;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorBody = await response.json();
        } else {
          errorBody = await response.text();
        }
      } catch (e) {
        console.error("[Server Proxy] Error parsing error response:", e);
        errorBody = "Error parsing response";
      }

      // Return error with proper status code
      event.node.res.statusCode = response.status;

      if (typeof errorBody === "string") {
        return {
          error: true,
          message: errorBody,
          status: response.status,
          statusText: response.statusText,
        };
      }

      return {
        ...errorBody,
        status: response.status,
        statusText: response.statusText,
      };
    }

    // Special handling for file downloads
    const contentType = response.headers.get("content-type");
    const isFileDownload =
      isFileRequest &&
      pathString.includes("/files/") &&
      method === "GET" &&
      contentType &&
      !contentType.includes("application/json");

    if (isFileDownload) {
      // For file downloads, return the raw response
      console.log(
        `[Server Proxy] File download detected (${contentType}), streaming response`
      );

      // Copy all headers from the backend response
      for (const [key, value] of response.headers.entries()) {
        event.node.res.setHeader(key, value);
      }

      // Stream the response as binary data
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }

    // Read response based on content type
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

    // Return the response - Nuxt will handle setting the status code
    return responseData;
  } catch (error: any) {
    console.error("[Server Proxy] Error:", error.message);
    return {
      error: "Proxy Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
