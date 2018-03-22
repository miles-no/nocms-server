import fs from 'fs';
import path from 'path';

let robotsTxtContent;

const api = {
  addRobotsTxt: (robotsTxtPath) => {
    const filePath = path.join(process.cwd(), robotsTxtPath);
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      robotsTxtContent = data;
    });
  },
  middleware: (req, res) => {
    if (!robotsTxtContent) {
      res.status(404).end();
      return;
    }
    res
      .append('Content-Type', 'text/plain')
      .status(200)
      .send(robotsTxtContent);
  },
};

export default api;
