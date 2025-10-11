# concepts: Session Management
URL: /docs/concepts/session-management
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/concepts/session-management.mdx

Better Auth session management.
        
***

title: Session Management
description: Better Auth session management.
--------------------------------------------

Better Auth manages session using a traditional cookie-based session management. The session is stored in a cookie and is sent to the server on every request. The server then verifies the session and returns the user data if the session is valid.

## Session table

The session table stores the session data. The session table has the following fields:

* `id`: The session token. Which is also used as the session cookie.
* `userId`: The user ID of the user.
* `expiresAt`: The expiration date of the session.
* `ipAddress`: The IP address of the user.
* `userAgent`: The user agent of the user. It stores the user agent header from the request.

## Session Expiration

The session expires after 7 days by default. But whenever the session is used and the `updateAge` is reached, the session expiration is updated to the current time plus the `expiresIn` value.

You can change both the `expiresIn` and `updateAge` values by passing the `session` object to the `auth` configuration.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    //... other config options
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
    }
})
```

### Disable Session Refresh

You can disable session refresh so that the session is not updated regardless of the `updateAge` option.

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    //... other config options
    session: {
        disableSessionRefresh: true
    }
})
```

## Session Freshness

Some endpoints in Better Auth require the session to be **fresh**. A session is considered fresh if its `createdAt` is within the `freshAge` limit. By default, the `freshAge` is set to **1 day** (60 \* 60 \* 24).

You can customize the `freshAge` value by passing a `session` object in the `auth` configuration:

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    //... other config options
    session: {
        freshAge: 60 * 5 // 5 minutes (the session is fresh if created within the last 5 minutes)
    }
})
```

To **disable the freshness check**, set `freshAge` to `0`:

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    //... other config options
    session: {
        freshAge: 0 // Disable freshness check
    }
})
```

## Session Management

Better Auth provides a set of functions to manage sessions.

### Get Session

The `getSession` function retrieves the current active session.

```ts client="client.ts"
import { authClient } from "@/lib/client"

const { data: session } = await authClient.getSession()
```

To learn how to customize the session response check the [Customizing Session Response](#customizing-session-response) section.

### Use Session

The `useSession` action provides a reactive way to access the current session.

```ts client="client.ts"
import { authClient } from "@/lib/client"

const { data: session } = authClient.useSession()
```

### List Sessions

The `listSessions` function returns a list of sessions that are active for the user.

```ts title="auth-client.ts"
import { authClient } from "@/lib/client"

const sessions = await authClient.listSessions()
```

### Revoke Session

When a user signs out of a device, the session is automatically ended. However, you can also end a session manually from any device the user is signed into.

To end a session, use the `revokeSession` function. Just pass the session token as a parameter.

```ts title="auth-client.ts"
await authClient.revokeSession({
    token: "session-token"
})
```

### Revoke Other Sessions

To revoke all other sessions except the current session, you can use the `revokeOtherSessions` function.

```ts title="auth-client.ts"
await authClient.revokeOtherSessions()
```

### Revoke All Sessions

To revoke all sessions, you can use the `revokeSessions` function.

```ts title="auth-client.ts"
await authClient.revokeSessions()
```

### Revoking Sessions on Password Change

You can revoke all sessions when the user changes their password by passing `revokeOtherSessions` as true on `changePassword` function.

```ts title="auth.ts"
await authClient.changePassword({
    newPassword: newPassword,
    currentPassword: currentPassword,
    revokeOtherSessions: true,
})
```

## Session Caching

### Cookie Cache

Calling your database every time `useSession` or `getSession` invoked isn’t ideal, especially if sessions don’t change frequently. Cookie caching handles this by storing session data in a short-lived, signed cookie—similar to how JWT access tokens are used with refresh tokens.

When cookie caching is enabled, the server can check session validity from the cookie itself instead of hitting the database each time. The cookie is signed to prevent tampering, and a short `maxAge` ensures that the session data gets refreshed regularly. If a session is revoked or expires, the cookie will be invalidated automatically.

To turn on cookie caching, just set `session.cookieCache` in your auth config:

```ts title="auth.ts"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    }
});
```

If you want to disable returning from the cookie cache when fetching the session, you can pass `disableCookieCache:true` this will force the server to fetch the session from the database and also refresh the cookie cache.

```ts title="auth-client.ts"
const session = await authClient.getSession({ query: {
    disableCookieCache: true
}})
```

or on the server

```ts title="server.ts"
await auth.api.getSession({
    query: {
        disableCookieCache: true,
    }, 
    headers: req.headers, // pass the headers
});
```

## Customizing Session Response

When you call `getSession` or `useSession`, the session data is returned as a `user` and `session` object. You can customize this response using the `customSession` plugin.

```ts title="auth.ts"
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [
        customSession(async ({ user, session }) => {
            const roles = findUserRoles(session.session.userId);
            return {
                roles,
                user: {
                    ...user,
                    newField: "newField",
                },
                session
            };
        }),
    ],
});
```

This will add `roles` and `user.newField` to the session response.

**Infer on the Client**

```ts title="auth-client.ts"
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"; // Import the auth instance as a type

const authClient = createAuthClient({
    plugins: [customSessionClient<typeof auth>()],
});

const { data } = authClient.useSession();
const { data: sessionData } = await authClient.getSession();
// data.roles
// data.user.newField
```

### Caveats on Customizing Session Response

1. The passed `session` object to the callback does not infer fields added by plugins.

However, as a workaround, you can pull up your auth options and pass it to the plugin to infer the fields.

```ts
import { betterAuth, BetterAuthOptions } from "better-auth";

const options = {
  //...config options
  plugins: [
    //...plugins 
  ]
} satisfies BetterAuthOptions;

export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins ?? []),
        customSession(async ({ user, session }, ctx) => {
            // now both user and session will infer the fields added by plugins and your custom fields
            return {
                user,
                session
            }
        }, options), // pass options here  // [!code highlight]
    ]
})
```

2. When your server and client code are in separate projects or repositories, and you cannot import the `auth` instance as a type reference, type inference for custom session fields will not work on the client side.
3. Session caching, including secondary storage or cookie cache, does not include custom fields. Each time the session is fetched, your custom session function will be called.

**Mutating the list-device-sessions endpoint**
The `/multi-session/list-device-sessions` endpoint from the [multi-session](/docs/plugins/multi-session) plugin is used to list the devices that the user is signed into.

You can mutate the response of this endpoint by passing the `shouldMutateListDeviceSessionsEndpoint` option to the `customSession` plugin.

By default, we do not mutate the response of this endpoint.

```ts title="auth.ts"
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [
        customSession(async ({ user, session }, ctx) => {
            return {
                user,
                session
            }
        }, {}, { shouldMutateListDeviceSessionsEndpoint: true }), // [!code highlight]
    ],
});
```

# reference: Options
URL: /docs/reference/options
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/reference/options.mdx

Better Auth configuration options reference.
        
***

title: Options
description: Better Auth configuration options reference.
---------------------------------------------------------

List of all the available options for configuring Better Auth. See [Better Auth Options](https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/types/options.ts#L13).

## `appName`

The name of the application.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	appName: "My App",
})
```

## `baseURL`

Base URL for Better Auth. This is typically the root URL where your application server is hosted. Note: If you include a path in the baseURL, it will take precedence over the default path.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	baseURL: "https://example.com",
})
```

If not explicitly set, the system will check for the environment variable `process.env.BETTER_AUTH_URL`

## `basePath`

Base path for Better Auth. This is typically the path where the Better Auth routes are mounted. It will be overridden if there is a path component within `baseURL`.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	basePath: "/api/auth",
})
```

Default: `/api/auth`

## `trustedOrigins`

List of trusted origins. You can provide a static array of origins, a function that returns origins dynamically, or use wildcard patterns to match multiple domains.

### Static Origins

You can provide a static array of origins:

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	trustedOrigins: ["http://localhost:3000", "https://example.com"],
})
```

### Dynamic Origins

You can provide a function that returns origins dynamically:

```ts
export const auth = betterAuth({
	trustedOrigins: async (request: Request) => {
		// Return an array of trusted origins based on the request
		return ["https://dynamic-origin.com"];
	}
})
```

### Wildcard Support

You can use wildcard patterns in trusted origins:

```ts
export const auth = betterAuth({
	trustedOrigins: [
		"*.example.com",             // Trust all subdomains of example.com
		"https://*.example.com",     // Trust only HTTPS subdomains
		"http://*.dev.example.com"   // Trust HTTP subdomains of dev.example.com
	]
})
```

## `secret`

The secret used for encryption, signing, and hashing.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	secret: "your-secret-key",
})
```

By default, Better Auth will look for the following environment variables:

* `process.env.BETTER_AUTH_SECRET`
* `process.env.AUTH_SECRET`

If none of these environment variables are set, it will default to `"better-auth-secret-123456789"`. In production, if it's not set, it will throw an error.

You can generate a good secret using the following command:

```bash
openssl rand -base64 32
```

## `database`

Database configuration for Better Auth.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	database: {
		dialect: "postgres",
		type: "postgres",
		casing: "camel"
	},
})
```

Better Auth supports various database configurations including [PostgreSQL](/docs/adapters/postgresql), [MySQL](/docs/adapters/mysql), and [SQLite](/docs/adapters/sqlite).

Read more about databases [here](/docs/concepts/database).

## `secondaryStorage`

Secondary storage configuration used to store session and rate limit data.

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
	// ... other options
    secondaryStorage: {
    	// Your implementation here
    },
})
```

Read more about secondary storage [here](/docs/concepts/database#secondary-storage).

## `emailVerification`

Email verification configuration.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }) => {
			// Send verification email to user
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
	},
})
```

* `sendVerificationEmail`: Function to send verification email
* `sendOnSignUp`: Send verification email automatically after sign up (default: `false`)
* `sendOnSignIn`: Send verification email automatically on sign in when the user's email is not verified (default: `false`)
* `autoSignInAfterVerification`: Auto sign in the user after they verify their email
* `expiresIn`: Number of seconds the verification token is valid for (default: `3600` seconds)

## `emailAndPassword`

Email and password authentication configuration.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		disableSignUp: false,
		requireEmailVerification: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		autoSignIn: true,
		sendResetPassword: async ({ user, url, token }) => {
			// Send reset password email
		},
		resetPasswordTokenExpiresIn: 3600, // 1 hour
		password: {
			hash: async (password) => {
				// Custom password hashing
				return hashedPassword;
			},
			verify: async ({ hash, password }) => {
				// Custom password verification
				return isValid;
			}
		}
	},
})
```

* `enabled`: Enable email and password authentication (default: `false`)
* `disableSignUp`: Disable email and password sign up (default: `false`)
* `requireEmailVerification`: Require email verification before a session can be created
* `minPasswordLength`: Minimum password length (default: `8`)
* `maxPasswordLength`: Maximum password length (default: `128`)
* `autoSignIn`: Automatically sign in the user after sign up
* `sendResetPassword`: Function to send reset password email
* `resetPasswordTokenExpiresIn`: Number of seconds the reset password token is valid for (default: `3600` seconds)
* `password`: Custom password hashing and verification functions

## `socialProviders`

Configure social login providers.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	socialProviders: {
		google: {
			clientId: "your-client-id",
			clientSecret: "your-client-secret",
			redirectURI: "https://example.com/api/auth/callback/google"
		},
		github: {
			clientId: "your-client-id",
			clientSecret: "your-client-secret",
			redirectURI: "https://example.com/api/auth/callback/github"
		}
	},
})
```

## `plugins`

List of Better Auth plugins.

```ts
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
	plugins: [
		emailOTP({
			sendVerificationOTP: async ({ email, otp, type }) => {
				// Send OTP to user's email
			}
		})
	],
})
```

## `user`

User configuration options.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	user: {
		modelName: "users",
		fields: {
			email: "emailAddress",
			name: "fullName"
		},
		additionalFields: {
			customField: {
				type: "string",
			}
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
				// Send change email verification
			}
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }) => {
				// Send delete account verification
			},
			beforeDelete: async (user) => {
				// Perform actions before user deletion
			},
			afterDelete: async (user) => {
				// Perform cleanup after user deletion
			}
		}
	},
})
```

* `modelName`: The model name for the user (default: `"user"`)
* `fields`: Map fields to different column names
* `additionalFields`: Additional fields for the user table
* `changeEmail`: Configuration for changing email
* `deleteUser`: Configuration for user deletion

## `session`

Session configuration options.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	session: {
		modelName: "sessions",
		fields: {
			userId: "user_id"
		},
		expiresIn: 604800, // 7 days
		updateAge: 86400, // 1 day
		disableSessionRefresh: true, // Disable session refresh so that the session is not updated regardless of the `updateAge` option. (default: `false`)
		additionalFields: { // Additional fields for the session table
			customField: {
				type: "string",
			}
		},
		storeSessionInDatabase: true, // Store session in database when secondary storage is provided (default: `false`)
		preserveSessionInDatabase: false, // Preserve session records in database when deleted from secondary storage (default: `false`)
		cookieCache: {
			enabled: true, // Enable caching session in cookie (default: `false`)	
			maxAge: 300 // 5 minutes
		}
	},
})
```

* `modelName`: The model name for the session (default: `"session"`)
* `fields`: Map fields to different column names
* `expiresIn`: Expiration time for the session token in seconds (default: `604800` - 7 days)
* `updateAge`: How often the session should be refreshed in seconds (default: `86400` - 1 day)
* `additionalFields`: Additional fields for the session table
* `storeSessionInDatabase`: Store session in database when secondary storage is provided (default: `false`)
* `preserveSessionInDatabase`: Preserve session records in database when deleted from secondary storage (default: `false`)
* `cookieCache`: Enable caching session in cookie

## `account`

Account configuration options.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	account: {
		modelName: "accounts",
		fields: {
			userId: "user_id"
		},
		encryptOAuthTokens: true, // Encrypt OAuth tokens before storing them in the database
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github", "email-password"],
			allowDifferentEmails: false
		}
	},
})
```

* `modelName`: The model name for the account
* `fields`: Map fields to different column names

### `encryptOAuthTokens`

Encrypt OAuth tokens before storing them in the database. Default: `false`.

### `updateAccountOnSignIn`

If enabled (true), the user account data (accessToken, idToken, refreshToken, etc.)
will be updated on sign in with the latest data from the provider.

### `accountLinking`

Configuration for account linking.

* `enabled`: Enable account linking (default: `false`)
* `trustedProviders`: List of trusted providers
* `allowDifferentEmails`: Allow users to link accounts with different email addresses
* `allowUnlinkingAll`: Allow users to unlink all accounts

## `verification`

Verification configuration options.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	verification: {
		modelName: "verifications",
		fields: {
			userId: "user_id"
		},
		disableCleanup: false
	},
})
```

* `modelName`: The model name for the verification table
* `fields`: Map fields to different column names
* `disableCleanup`: Disable cleaning up expired values when a verification value is fetched

## `rateLimit`

Rate limiting configuration.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	rateLimit: {
		enabled: true,
		window: 10,
		max: 100,
		customRules: {
			"/example/path": {
				window: 10,
				max: 100
			}
		},
		storage: "memory",
		modelName: "rateLimit"
	}
})
```

* `enabled`: Enable rate limiting (defaults: `true` in production, `false` in development)
* `window`: Time window to use for rate limiting. The value should be in seconds. (default: `10`)
* `max`: The default maximum number of requests allowed within the window. (default: `100`)
* `customRules`: Custom rate limit rules to apply to specific paths.
* `storage`: Storage configuration. If you passed a secondary storage, rate limiting will be stored in the secondary storage. (options: `"memory", "database", "secondary-storage"`, default: `"memory"`)
* `modelName`: The name of the table to use for rate limiting if database is used as storage. (default: `"rateLimit"`)

## `advanced`

Advanced configuration options.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false
		},
		useSecureCookies: true,
		disableCSRFCheck: false,
		crossSubDomainCookies: {
			enabled: true,
			additionalCookies: ["custom_cookie"],
			domain: "example.com"
		},
		cookies: {
			session_token: {
				name: "custom_session_token",
				attributes: {
					httpOnly: true,
					secure: true
				}
			}
		},
		defaultCookieAttributes: {
			httpOnly: true,
			secure: true
		},
		cookiePrefix: "myapp",
		database: {
			// If your DB is using auto-incrementing IDs, set this to true.
			useNumberId: false,
			// Use your own custom ID generator, or disable generating IDs as a whole.
			generateId: (((options: {
				model: LiteralUnion<Models, string>;
				size?: number;
			}) => {
				return "my-super-unique-id";
			})) | false,
			defaultFindManyLimit: 100,
		}
	},
})
```

* `ipAddress`: IP address configuration for rate limiting and session tracking
* `useSecureCookies`: Use secure cookies (default: `false`)
* `disableCSRFCheck`: Disable trusted origins check (⚠️ security risk)
* `crossSubDomainCookies`: Configure cookies to be shared across subdomains
* `cookies`: Customize cookie names and attributes
* `defaultCookieAttributes`: Default attributes for all cookies
* `cookiePrefix`: Prefix for cookies
* `generateId`: Function to generate a unique ID for a model

## `logger`

Logger configuration for Better Auth.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	logger: {
		disabled: false,
		disableColors: false,
		level: "error",
		log: (level, message, ...args) => {
			// Custom logging implementation
			console.log(`[${level}] ${message}`, ...args);
		}
	}
})
```

The logger configuration allows you to customize how Better Auth handles logging. It supports the following options:

* `disabled`: Disable all logging when set to `true` (default: `false`)
* `disableColors`: Disable colors in the default logger implementation (default: determined by the terminal's color support)
* `level`: Set the minimum log level to display. Available levels are:
  * `"info"`: Show all logs
  * `"warn"`: Show warnings and errors
  * `"error"`: Show only errors
  * `"debug"`: Show all logs including debug information
* `log`: Custom logging function that receives:
  * `level`: The log level (`"info"`, `"warn"`, `"error"`, or `"debug"`)
  * `message`: The log message
  * `...args`: Additional arguments passed to the logger

Example with custom logging:

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	logger: {
		level: "info",
		log: (level, message, ...args) => {
			// Send logs to a custom logging service
			myLoggingService.log({
				level,
				message,
				metadata: args,
				timestamp: new Date().toISOString()
			});
		}
	}
})
```

## `databaseHooks`

Database lifecycle hooks for core operations.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					// Modify user data before creation
					return { data: { ...user, customField: "value" } };
				},
				after: async (user) => {
					// Perform actions after user creation
				}
			},
			update: {
				before: async (userData) => {
					// Modify user data before update
					return { data: { ...userData, updatedAt: new Date() } };
				},
				after: async (user) => {
					// Perform actions after user update
				}
			}
		},
		session: {
			// Session hooks
		},
		account: {
			// Account hooks
		},
		verification: {
			// Verification hooks
		}
	},
})
```

## `onAPIError`

API error handling configuration.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	onAPIError: {
		throw: true,
		onError: (error, ctx) => {
			// Custom error handling
			console.error("Auth error:", error);
		},
		errorURL: "/auth/error"
	},
})
```

* `throw`: Throw an error on API error (default: `false`)
* `onError`: Custom error handler
* `errorURL`: URL to redirect to on error (default: `/api/auth/error`)

## `hooks`

Request lifecycle hooks.

```ts
import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			// Execute before processing the request
			console.log("Request path:", ctx.path);
		}),
		after: createAuthMiddleware(async (ctx) => {
			// Execute after processing the request
			console.log("Response:", ctx.context.returned);
		})
	},
})
```

For more details and examples, see the [Hooks documentation](/docs/concepts/hooks).

## `disabledPaths`

Disable specific auth paths.

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
	disabledPaths: ["/sign-up/email", "/sign-in/email"],
})
```

## `telemetry`

Enable or disable Better Auth's telemetry collection. (default: `false`)

```ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
  telemetry: {
    enabled: false,
  }
})
```

# integrations: Nuxt Integration
URL: /docs/integrations/nuxt
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/integrations/nuxt.mdx

Integrate Better Auth with Nuxt.
        
***

title: Nuxt Integration
description: Integrate Better Auth with Nuxt.
---------------------------------------------

Before you start, make sure you have a Better Auth instance configured. If you haven't done that yet, check out the [installation](/docs/installation).

### Create API Route

We need to mount the handler to an API route. Create a file inside `/server/api/auth` called `[...all].ts` and add the following code:

```ts title="server/api/auth/[...all].ts"
import { auth } from "~/lib/auth"; // import your auth config

export default defineEventHandler((event) => {
	return auth.handler(toWebRequest(event));
});
```

<Callout type="info">
  You can change the path on your better-auth configuration but it's recommended to keep it as `/api/auth/[...all]`
</Callout>

### Migrate the database

Run the following command to create the necessary tables in your database:

```bash
npx @better-auth/cli migrate
```

## Create a client

Create a client instance. You can name the file anything you want. Here we are creating `client.ts` file inside the `lib/` directory.

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/vue" // make sure to import from better-auth/vue

export const authClient = createAuthClient({
    //you can pass client configuration here
})
```

Once you have created the client, you can use it to sign up, sign in, and perform other actions.
Some of the actions are reactive.

### Example usage

```vue title="index.vue"
<script setup lang="ts">
import { authClient } from "~/lib/client"
const session = authClient.useSession()
</script>

<template>
    <div>
        <button v-if="!session?.data" @click="() => authClient.signIn.social({
            provider: 'github'
        })">
            Continue with GitHub
        </button>
        <div>
            <pre>{{ session.data }}</pre>
            <button v-if="session.data" @click="authClient.signOut()">
                Sign out
            </button>
        </div>
    </div>
</template>
```

### Server Usage

The `api` object exported from the auth instance contains all the actions that you can perform on the server. Every endpoint made inside Better Auth is a invocable as a function. Including plugins endpoints.

**Example: Getting Session on a server API route**

```tsx title="server/api/example.ts"
import { auth } from "~/lib/auth";

export default defineEventHandler((event) => {
    const session = await auth.api.getSession({
      headers: event.headers
    });

   if(session) {
     // access the session.session && session.user
   }
});
```

### SSR Usage

If you are using Nuxt with SSR, you can use the `useSession` function in the `setup` function of your page component and pass `useFetch` to make it work with SSR.

```vue title="index.vue"
<script setup lang="ts">
import { authClient } from "~/lib/auth-client";

const { data: session } = await authClient.useSession(useFetch);
</script>

<template>
    <p>
        {{ session }}
    </p>
</template>
```

### Middleware

To add middleware to your Nuxt project, you can use the `useSession` method from the client.

```ts title="middleware/auth.global.ts"
import { authClient } from "~/lib/auth-client";
export default defineNuxtRouteMiddleware(async (to, from) => {
	const { data: session } = await authClient.useSession(useFetch); 
	if (!session.value) {
		if (to.path === "/dashboard") {
			return navigateTo("/");
		}
	}
});
```

### Resources & Examples

* [Nuxt and Nuxt Hub example](https://github.com/atinux/nuxthub-better-auth) on GitHub.
* [NuxtZzle is Nuxt,Drizzle ORM example](https://github.com/leamsigc/nuxt-better-auth-drizzle) on GitHub [preview](https://nuxt-better-auth.giessen.dev/)
* [Nuxt example](https://stackblitz.com/github/better-auth/examples/tree/main/nuxt-example) on StackBlitz.
* [NuxSaaS (Github)](https://github.com/NuxSaaS/NuxSaaS) is a full-stack SaaS Starter Kit that leverages Better Auth for secure and efficient user authentication. [Demo](https://nuxsaas.com/)
* [NuxtOne (Github)](https://github.com/nuxtone/nuxt-one) is a Nuxt-based starter template for building AIaaS (AI-as-a-Service) applications [preview](https://www.one.devv.zone)

