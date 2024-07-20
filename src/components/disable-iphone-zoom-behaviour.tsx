"use client";

import { useEffect } from "react";

// Solution found @ https://weblog.west-wind.com/posts/2023/Apr/17/Preventing-iOS-Safari-Textbox-Zooming
export default function DisableIphoneZoomBehaviour() {

    useEffect(() => {
        if(navigator.userAgent.indexOf('iPhone') > -1)
        {
            const viewport_meta_elem = document.querySelector("[name=viewport]") as HTMLMetaElement;

            if(viewport_meta_elem) {
                viewport_meta_elem.setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1");
            }
        }
    }, []);


    return <></>
}