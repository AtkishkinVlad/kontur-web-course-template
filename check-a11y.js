import { launch } from "puppeteer";
import { AxePuppeteer } from "axe-puppeteer";
import { createServer } from "http-server";

const server = createServer({ root: "./index.html" });
const port = 8080;

server.listen(port, async () => {
  const browser = await launch();
  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}/index.html`);

  const results = await new AxePuppeteer(page).analyze();

  if (results.violations.length > 0) {
    console.error("Accessibility violations found:");

    results.violations.forEach((violation) => {
      console.error(violation);
    });

    process.exit(1);
  }

  await browser.close();
  server.close();
});
