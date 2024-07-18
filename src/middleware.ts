import { NextRequest, NextResponse } from "next/server";

const depricated_urls = {
    '/create/conversation': '/conversation/create',
    '/shared/': '/conversation/analysis/',
}

export async function middleware(request: NextRequest) {

    const url = request.nextUrl.pathname;

    for (const [depricated_url, new_url] of Object.entries(depricated_urls)) {
        if (url.startsWith(depricated_url)) {
            return NextResponse.redirect(url.replace(depricated_url, new_url));
        }
    }
    
}