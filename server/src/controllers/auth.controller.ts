import { AuthenticationResponse } from "@scalekit-sdk/node";
import { ENV } from "../lib/env";
import { scalekit } from "../lib/scalekit";
import { ApiError } from "../utils/api-err";
import { ApiResponse } from "../utils/api-res";
import { async_hander } from "../utils/async-handler";

export const login = async_hander(async (_req, res) => {
    const URI = scalekit.getAuthorizationUrl(`${ENV.NODE_API_URI}/api/v1/auth/callback`);

    if (!URI?.trim()) {
        throw new ApiError(400, "faild to login try again");
    }

    return res.redirect(URI);
});

export const callback = async_hander(async (req, res) => {
    const { code } = req.query as { code: string };

    if (!code) {
        throw new ApiError(400, "Failed to login, try again");
    }

    const result: AuthenticationResponse = await scalekit.authenticateWithCode(code,`${ENV.NODE_API_URI}/api/v1/auth/callback`);

    res.cookie("access-token", result.accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });

    return res.redirect(`${ENV.CORS_ORIGIN}/chat`);
});

export const logout = async_hander(async (_req, res) => {
    res.clearCookie("access-token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    const logoutUrl = scalekit.getLogoutUrl({
        postLogoutRedirectUri: ENV.CORS_ORIGIN,
    });

    return res.status(200).json(new ApiResponse(200, "success"));
});

export const getUser = async_hander(async (req, res) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const result: any = await scalekit.validateToken(accessToken);
    const user = await scalekit.user.getUser(result.sub);

    return res.status(200).json(new ApiResponse(200, "success", user.user?.userProfile?.id));
});
