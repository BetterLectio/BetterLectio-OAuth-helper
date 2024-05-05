
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { google as googleLib } from 'googleapis';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return error(400, 'Missing google auth');

    const calAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    calAuth.setCredentials(decodedGoogleToken);
    const calApi = googleLib.calendar({ version: 'v3', auth: calAuth });

    try {
        await calApi.calendarList.list();
    } catch (e) {
        return error(401, 'Invalid google token');
    }
    return new Response("OK", {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    });
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    });
};