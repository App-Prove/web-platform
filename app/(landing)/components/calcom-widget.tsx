import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function CalcomWidget() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ "namespace": "30min" });
            cal("ui", { "theme": "dark", "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        })();
    }, [])
    return <Cal namespace="30min"
        calLink="hugo-demenez/30min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ "layout": "month_view", "theme": "dark" }}
    />;
};