export const makeRequest = async <T>(url: string, method: 'GET' | 'POST', body: any): Promise<T> => {
  const response = await fetch(
    url,
    {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  const returnBody = await response.json();

  if (!response.ok) {
    throw new Error(returnBody?.error ?? '')
  }

  return returnBody
}
