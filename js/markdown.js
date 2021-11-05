const h1 = /^#\s(.*$)/gm;
const h2 = /^##\s(.*$)/gm;
const h3 = /^###\s(.*$)/gm;
const h4 = /^####\s(.*$)/gm;
const h5 = /^#####\s(.*$)/gm;
const h6 = /^######\s(.*$)/gm;
const code = /`(.*?)`/gm;
const bq = /> (.*$)/gm;
const link = /\[([^\]]+)\]\(([^\)]+)\)/gm;
const image = /!\[([^\]]+)\]\(([^\)]+)\)/gm;
const italic = /\*(.*?)\*/;
const bold = /\*\*(.*?)\*\*/gm;
const ib = /\*\*\*(.*?)\*\*\*/gm;
const li = /- (.*$)/gm;
const dli = /- - (.*$)/gm;
/**
 *
 * @param {String} str
 */
export function parse(str) {
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
        .replace(bq, "<blockquote>$1</blockquote>");
}
