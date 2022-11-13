const crypto = require('crypto');

const app = require('express')();
const dotenv = require('dotenv');

dotenv.config();

const baseUri = 'https://sandboxapi.rapyd.net';

const accessKey = process.env.RAPYD_ACCESS_KEY;
const secretKey = process.env.RAPYD_SECRET_KEY;

function sign(method, urlPath, salt, timestamp, bodyString) {
  try {
    let toSign =
      method.toLowerCase() +
      urlPath +
      salt +
      timestamp +
      accessKey +
      secretKey +
      bodyString;

    let hash = crypto.createHmac('sha256', secretKey);
    hash.update(toSign);

    const signature = Buffer.from(hash.digest('hex')).toString('base64');
    return signature;
  } catch (error) {
    console.error('Error generating signature');
    throw error;
  }
}

async function makeRequest(method, type = 'GET', body = null) {
  let salt = crypto.randomBytes(8).toString('hex');

  let timestamp = Math.round(new Date().getTime() / 1000);
  let urlPath = `/v1/${method}`;

  let bodyString = '';

  if (body && Object.entries(body).length != 0) {
    bodyString = JSON.stringify(body);
  }
  let signature = sign(type, urlPath, salt, timestamp, bodyString);

  let data = await fetch(baseUri + urlPath, {
    method: type,
    headers: {
      'Content-Type': 'application/json',
      salt: salt,
      timestamp: timestamp,
      signature: signature,
      access_key: accessKey,
    },
    body: bodyString || null,
  });
  return await data.json();
}

app.post('/call', async (req, res) => {
  let method = req.query.method;
  let type = req.query.type;

  delete req.query.method;
  delete req.query.type;

  let parse = '';
  Object.entries(req.query).map((d, index) => {
    parse += (index == 0 ? '?' : '&') + d[0] + '=' + d[1];
  });
  console.log(req.body);

  let data = await makeRequest(method + parse, type, req.body);
  if (data.status.status === 'SUCCESS') {
    res.json({ data: data.data });
    return;
  }
  res.json({ error: data.status.message });
});

const PORT = process.env.PORT || 5000;

app.use('/*', (req, res) => {
  res.redirect('https://google.com');
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
