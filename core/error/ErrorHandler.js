const fs = require("fs");
const path = require("path");

class ErrorHandler {

    constructor(err, req, res, next) {
        console.log('here');
        
        this.errorHandler(err, req, res, next);
    }

    getFileSnippet(filePath, errorLine, context = 3) {
        try {
            const lines = fs.readFileSync(filePath, "utf-8").split("\n");
            const start = Math.max(0, errorLine - context - 1);
            const end = Math.min(lines.length, errorLine + context);

            return lines
                .slice(start, end)
                .map((line, i) => {
                    const lineNumber = start + i + 1;
                    const cssClass = lineNumber === errorLine ? "line error" : "line";
                    return `<div class="${cssClass}"><span class="line-number">${lineNumber}:</strong> ${line}</div>`;
                })
                .join("");
        } catch (e) {
            return "";
        }
    }

    errorHandler(err, req, res, next) {
        const template = fs.readFileSync(path.join(__dirname, "trace.html"), "utf-8");
        const stackLines = (err.stack || "")
            .split("\n")
            .map(line => {
                let snippetHtml = "";
                const match = line.match(/\((.*):(\d+):(\d+)\)/); // extract file & line
                if (match) {
                    const [, filePath, lineNum] = match;
                    snippetHtml = `<div class="file-snippet">${this.getFileSnippet(filePath, parseInt(lineNum, 10))}</div>`;
                }
                return `<div class="stack-line"><div class="stack-message">${line}</div>${snippetHtml}</div>`;
            })
            .join("");

        const html = template
            .replace("{{errorName}}", err.name)
            .replace("{{errorMessage}}", err.message)
            .replace("{{stackLines}}", stackLines);

        res.status(500).send(html);

        next();
    }
}

module.exports = ErrorHandler;