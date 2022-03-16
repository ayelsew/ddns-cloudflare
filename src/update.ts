import httpsRequest, { HttpResponse } from "./request";

interface DNSRecordInfo {
  id: string,
  zone_id: string,
  zone_name: string,
  name: string,
  type: string,
  content: string,
  proxiable: boolean,
  proxied: boolean,
  ttl: number,
  locked: boolean,
  meta: Record<string, unknown>,
  created_on: string,
  modified_on: string
}

export default async function update(domain: string, dnsRecordName: string, email: string, token: string) {
  let zone_id = undefined
  let recordInfo: DNSRecordInfo = undefined;

  const headers = {
    Authorization: token,
    'X-Auth-Email': email,
    'Content-type': 'application/json'
  }

  let response: HttpResponse;

  try {
    // Verify if token is valid
    response = await httpsRequest({
      method: 'GET',
      host: 'api.cloudflare.com',
      path: '/client/v4/user/tokens/verify',
      headers,
    })

    if (response.code !== 200) {
      return Promise.reject(response)
    }


    // Get de zone ID (Zone ID is the identifier of domain at Cloudflare)

    response = await httpsRequest({
      method: 'GET',
      host: 'api.cloudflare.com',
      path: `/client/v4/zones?name=${domain}`,
      headers,
    })

    if (response.code !== 200) {
      return Promise.reject(response)
    }

    zone_id = response.payload.result[0].id;



    // Get all information about record name of DNS
    response = await httpsRequest({
      method: 'GET',
      host: 'api.cloudflare.com',
      path: `/client/v4/zones/${zone_id}/dns_records?name=${dnsRecordName}`,
      headers,
    })

    if (response.code !== 200) {
      return Promise.reject(response)
    }

    recordInfo = response.payload.result[0];


    // Asking to another server what's the public IP, where this script are runs
    response = await httpsRequest({
      method: 'GET',
      host: 'ifconfig.me',
      path: '/ip'
    })

    if (response.code !== 200) {
      return Promise.reject(response)
    }

    const hostIP = response.payload

    if (hostIP !== recordInfo.content) {
      console.info(`New IP detected: ${hostIP.payload}, the old ${recordInfo.content}`)

      // Start to update IP address on DNS record
      const response = await httpsRequest({
        method: 'PUT',
        host: 'api.cloudflare.com',
        path: `/client/v4/zones/${zone_id}/dns_records/${recordInfo.id}`,
        headers,
      }, JSON.stringify({
        type: recordInfo.type,
        name: recordInfo.name,
        content: hostIP,
        ttl: recordInfo.ttl,
        proxied: recordInfo.proxied,
      }))

      console.log(response.payload.result)
    } else console.info(`The DNS record: ${recordInfo.name} is already updated to ${hostIP}`)
  } catch (error) {
    return Promise.reject(error)
  }
}
