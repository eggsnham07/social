type VideoData = {
    author_name: string,
    author_url: string,
    height: number,
    html: string,
    provider_name: string,
    provider_url: string,
    thumbnail_height: number,
    thumbnail_url: string,
    thumbnail_width: number,
    title: string,
    type: string,
    url: string,
    verion: string,
    width: string
}

const h1 = /^#\s(.*$)/gm
const h2 = /^##\s(.*$)/gm
const h3 = /^###\s(.*$)/gm
const h4 = /^####\s(.*$)/gm
const h5 = /^#####\s(.*$)/gm
const h6 = /^######\s(.*$)/gm

const code = /`(.*?)`/gm
const bq = /> (.*$)/gm

const link = /\[([^\]]+)\]\(([^\)]+)\)/gm
const image = /!\[([^\]]+)\]\(([^\)]+)\)/gm
const italic = /\*(.*?)\*/
const bold = /\*\*(.*?)\*\*/gm
const ib = /\*\*\*(.*?)\*\*\*/gm

const li = /- (.*$)/gm
const dli = /- - (.*$)/gm

const youtube = /https:\/\/www.youtube.com\/watch\?v=(.*$)/gm

/**
 * 
 * @param {String} str 
 */
export function parse(str:string): string {
    const style = {
        iframe: `border-radius: 20px;
        margin: 0 auto;
        width: 100%;
        height: 250px;`,
        card: `font-family: Arial, Helvetica, sans-serif;
        border: 3px solid #333;
        border-radius: 20px;
        min-height: 300px;
        width: 25%;
        margin: 0 auto;
        padding: 12px;`
    };
    var data:VideoData;
    //@ts-ignore
    if (str.includes("https://www.youtube.com") && typeof $ !== "undefined") {
        var url = str.match(youtube);
        //@ts-ignore
        if ((url === null || url === void 0 ? void 0 : url.length) > 0) {
            //@ts-ignore
            $.getJSON("https://noembed.com/embed", {
                format: "json",
                //@ts-ignore
                url: url[0]
            }, function (d:VideoData) {
                data = d;
                console.log("Working...")
            });
        }
    }
    return str
        .replace(h1, "<h1 id=\'$1\'>$1</h1><hr>")
        .replace(h2, "<h2 id=\'$1\'>$1</h2>")
        .replace(h3, "<h3 id=\'$1\'>$1</h3>")
        .replace(h4, "<h4 id=\'$1\'>$1</h4>")
        .replace(h5, "<h5 id=\'$1\'>$1</h5>")
        .replace(h6, "<h6 id=\'$1\'>$1</h3>")
        .replace(/\n\n/gm, "<br>")
        .replace(dli, "<li class=\'tab\'>$1</li>")
        .replace(li, "<li>$1</li>")
        .replace(image, "<img src=\"$2\" alt=\"$1\">")
        .replace(link, "<a href=\"$2\">$1</a>")
        .replace(code, "<code>$1</code>")
        .replace(ib, "<b><i>$1</i></b>")
        .replace(bold, "<b>$1</b>")
        .replace(italic, "<i>$1</i>")
        .replace(bq, "<blockquote>$1</blockquote>")
}