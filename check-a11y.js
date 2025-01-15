import { launch } from "puppeteer";
import { AxePuppeteer } from "axe-puppeteer";
import { createServer } from "http-server";
import { exit } from "node:process";

const server = createServer({ root: "./pages/index" });
const port = 8080;

server.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);

  const browser = await launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}/index.html`);

  const results = await new AxePuppeteer(page).analyze();

  if (results.violations.length > 0) {
    console.error("Accessibility violations found:");

    results.violations.forEach((violation) => {
      console.error(violation);
    });

    exit(1);
  } else {
    console.log("No accessibility violations found.");
  }

  await browser.close();
  server.close();
});
