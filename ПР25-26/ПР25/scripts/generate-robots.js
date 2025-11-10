const { createWriteStream } = require('fs');
const { resolve } = require('path');

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
`;

function generateRobotsTxt() {
  try {
    const writeStream = createWriteStream(resolve('./dist/robots.txt'));
    writeStream.write(robotsTxt.trim());
    writeStream.end();
    console.log('Robots.txt generated successfully!');
  } catch (error) {
    console.error('Error generating robots.txt:', error);
  }
}

generateRobotsTxt();