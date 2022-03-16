import { IncomingHttpHeaders } from 'http';
import https from 'https';

export interface HttpResponse {
  code: number,
  headers: IncomingHttpHeaders,
  payload: any
}

export type HttpRequest = https.RequestOptions;

export default function httpsRequest(options: https.RequestOptions, data?: any): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const request = https.request(options)

    if (data) request.write(data);

    request.on('response', (response) => {
      const cache = []
      response.on('data', (data: Buffer) => cache.push(data))

      response.on('end', () => {
        let payload = Buffer.concat(cache).toString();

        if (response.headers['content-type'] === 'application/json')
          payload = JSON.parse(payload);

        resolve({
          code: response.statusCode,
          headers: response.headers,
          payload,
        })
      })
    })

    request.on('error', (error) => reject(error));
    request.end()
  })

}
