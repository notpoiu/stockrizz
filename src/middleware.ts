import { NextRequest, NextResponse } from "next/server";

const depricated_urls = {
    '/create/conversation': '/conversation/create',
    '/shared/': '/conversation/analysis/',
}

export async function middleware(request: NextRequest) {

    const url = request.nextUrl.pathname;

    for (const [key, value] of Object.entries(depricated_urls)) {
        if (url.startsWith(key)) {
            return NextResponse.redirect(value);
        }
    }
    
}